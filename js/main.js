var pages = [],
currentPage = "",
currentTheme = "",
currentLocation = 0,
currentTask = 0,
scoreDBTB = 0;
scoreMC = 0,
scoreLF = 0,
scoreNGU = 0,
onboarding = 0,
gameScore = 0;
gameCount = 0;
gameDate = "";
loctask = "";
themeVideo = "",
interval = null,
isCorrect = false,
isComplete = false,
isFirst = true,
isBack = false,
isDBTB = false,
isLF = false,
isMC = false,
isNGU = false;

let compass;
var pz;

$(document).ready(function () {

	init();

});

function init() {
	console.log("init ready! " + window.innerWidth + " , " + window.innerHeight);
	$(".topMenu").hide();
	closePopups();
	
	//$(".mapImage").css("zoom", 1);

	$(":mobile-pagecontainer").on("pagecontainerchange", function (event, ui) {
		currentPage = ui.toPage[0].id;
		switch (ui.toPage[0].id) {
			case "landing":
				$(".page_landing video.wait")[0].pause();
				$(".page_landing video.watkinCircle")[0].play();
				$("audio.watkinCircle source").attr("src", "audio/intro.mp3");
				$("audio.watkinCircle")[0].load();
			break;
			case "map":
				if(isFirst){
					pz = PinchZoomer.get("pz1");
					pz.zoom(0.5);
					pz.x(-990);
					pz.y(-340);
					isFirst = false;
					pz.on(PinchZoomer.ZOOM, onZoom);
				}
			break;
			case "location":
				$(".page_location video.wait")[0].pause();
				$(".page_location video.watkinCircle")[0].play();
				$("audio.watkinCircle source").attr("src", json.Location[currentLocation].BodyAudio);
				$("audio.watkinCircle")[0].load();
			break;
			case "themeIntro":
					$(".page_themeIntro video source").attr("src", themeVideo);
					$(".page_themeIntro video")[0].load();
				break;
			case "taskContent":
				$(".page_taskContent video")[0].pause();
			break;
			case "locationIntro":
				$(".page_locationIntro video")[0].pause();
			break;
			case "taskIntro":
				$(".page_taskIntro video")[0].pause();
			break;
			case "help":
				$(".page_help video")[0].pause();
			break;
			case "about":
				$(".page_about video")[0].pause();
			break;
			case "contact":
				$(".page_contact video")[0].pause();
			break;
			case "credits":
				$(".page_credits video")[0].pause();
			break;
		}
	});

	$(":mobile-pagecontainer").on("pagecontainerbeforechange", function (event, ui) {
		if(ui.toPage[0].id){

		
			$("video").each(function () {
				$(this).get(0).pause();
			});
			console.log("SHOW ME " + ui.toPage[0].id);
			
			clearInterval(interval);
			closePopups();
			
			if (!isBack) {
				switch(ui.options.fromPage[0].id) {
					case "landing":
					case "map":
					case "locationList":
					case "rewardList":
					case "themeList":
						if(pages[pages.length-1] != ui.options.fromPage[0].id) pages.push(ui.options.fromPage[0].id);
						break;
				}
				
			}
			$(".topMenu").show();
			$("body").removeClass("splash green pink purple lightblue dbtb_back lf_back mc_back ngu_back");

			switch (ui.toPage[0].id) {
				case "landing":
					$(".topMenu").hide();
					break;
				case "map":
					$(".title h1").html("Map");
					console.log("Onboarding step: " + onboarding);
					if(onboarding < 3){
						ShowOnboarding();
					}else if(!isDBTB && scoreDBTB > 2){
						isDBTB = true;
						ShowCongrats(0);

					} else if(!isLF && scoreLF > 2){
						isLF = true;
						ShowCongrats(1);

					} else if(!isMC && scoreMC > 2){
						isMC = true;
						ShowCongrats(2);

					} else if(!isNGU && scoreNGU > 2){
						isNGU = true;
						ShowCongrats(3);
					}else{
						playFX("gull");
					}
					break;
				case "menu":
					$(".title h1").html("Menu");
					break;
				case "themeList":
					$(".title h1").html("Themes");
					break;
				case "themeIntro":
					switch (currentTheme) {
						case "DBTB":
							$(".title h1").html("Dream Big, Think Big");
							$(".page_themeIntro p").html("We can all dream. But how do you turn dreams into reality?<br><br>Watkin had brilliant ideas. He also made things happen.<br><br>He could see the bigger picture. That's the tricky part.");
							$("body").addClass("green dbtb_back");
							themeVideo = "video/theme_DBTB_b_280-003_dark blue_280.mp4";
							break;
						case "LF":
							$(".title h1").html("Look Forward");
							$(".page_themeIntro p").html("Watkin had a vision for Cleethorpes. Thanks to him, it grew into a busy resort.<br><br>He only had the technology of his time, but he saw what might be needed in the future too.");
							$("body").addClass("purple lf_back");
							themeVideo = "video/theme_LF_280-003_blue_280.mp4";
							break;
						case "MC":
							$(".title h1").html("Make Connections");
							$(".page_themeIntro p").html("Watkin was great at getting things done. He knew how to get the right people together. In the right place at the right time.<br><br>The railway is a great example of this.");
							$("body").addClass("lightblue mc_back");
							themeVideo = "video/theme_MC_280-003.mp4";
							break;
						case "NGU":
							$(".title h1").html("Never Give Up");
							$(".page_themeIntro p").html("The thing about Watkin is that he never gave up. Even when he failed. Which he did.<br><br>He had some big setbacks. But he kept trying. That's how you learn.");
							$("body").addClass("pink ngu_back");
							themeVideo = "video/theme_NGU_280-004_dark blue_280.mp4";
							break;
					}
					break;
				case "locationList":
					$(".title h1").html("Locations");
					break;
				case "locationIntro":
					$(".starthere").hide();
					$(".title h1").html(json.Location[currentLocation].Title);
					$(".page_locationIntro p").html(json.Location[currentLocation].Intro);
					$(".page_locationIntro .headerImage").attr("src", "ui/Header/loc" + currentLocation + ".png");
					$(".popHeader").css("background-image", "url(ui/Texture/loc" + currentLocation + ".png)");
					isCorrect = false;
					break;
				case "location":
					$(".title h1").html(json.Location[currentLocation].Title);
					$(".page_location .backWatkin p").html(json.Location[currentLocation].Body);
					$(".page_location .backPresenter p").html(json.Location[currentLocation].BodyCTA);
					$(".page_location .headerImage").attr("src", "ui/Header/loc" + currentLocation + ".png");
					showTaskList();
					$("#map_" + currentLocation).addClass("visited");
					$("#loc_" + currentLocation).addClass("blue");
					break;
				case "rewardList":
					$(".title h1").html("Rewards");
					playFX("sparkle");
					calculateScore();
					break;
				case "taskIntro":
					isComplete = false;
					locTask = currentLocation + "." + currentTask;
					$(".page_taskIntro .buttonCTA").show();
					$(".audioBar").hide();
					$(".title h1").html(json.Location[currentLocation].Activity[currentTask].Title);
					$(".page_taskIntro .headerImage").attr("src", "ui/Header/loc" + currentLocation + ".png");
					$(".page_taskIntro .backWatkin p").html(json.Location[currentLocation].Activity[currentTask].Intro);
					SetThemeBackground();
					switch (json.Location[currentLocation].Activity[currentTask].CTA) {
						case "Listen":
							$(".page_taskIntro .buttonCTA").hide();
							$(".progressBar").css("width",  "0%");
							$(".audioBar").show();
							break;
						case "":
							$(".page_taskIntro .buttonCTA h2").html("Begin the task");
							break;
						default:
							$(".page_taskIntro .buttonCTA h2").html(json.Location[currentLocation].Activity[currentTask].CTA);
							break;
					}
					SetTask();
				break;
				case "taskContent":
					SetThemeBackground();
					$(".topMenu").hide();
					break;
				case "help":
					$(".title h1").html("Help");
					break;
				case "about":
					$(".title h1").html("About");
					break;
				case "contact":
					$(".title h1").html("Contact");
					break;
				case "credits":
					$(".title h1").html("Credits");
					break;
				case "resources":
					$(".title h1").html("Resources");
					break;
			}
			isBack = false;
		}
	});

	$(".buttonCTA").click(function () {
		$("audio.watkinCircle")[0].pause();
		switch ($.mobile.pageContainer.pagecontainer('getActivePage').attr('id')) {
			case "splash":
				getLocation();
				startCompass();
				$(":mobile-pagecontainer").pagecontainer("change", "#landing", {changeHash: false});
				break;
			case "landing":
				$(":mobile-pagecontainer").pagecontainer("change", "#map", {changeHash: false});
				break;
			case "locationIntro":
				if (isCorrect) {
					$(":mobile-pagecontainer").pagecontainer("change", "#location", {changeHash: false});
				} else {
					showQuestion();
				}
				break;
			case "themeIntro":
				$(":mobile-pagecontainer").pagecontainer("change", "#locationList", {changeHash: false});
				break;
			case "taskIntro":
				if (isComplete) {
					$(":mobile-pagecontainer").pagecontainer("change", "#location", {changeHash: false});
				} else {
					switch(locTask){
						case "3.0":
						case "3.1":
						case "10.0":
						case "14.0":
							taskComplete();
							break;
						default:
							initGlass();
							$(":mobile-pagecontainer").pagecontainer("change", "#taskContent", {changeHash: false});
							break;
					}
					
				}
			break;
			case "taskContent":
			case "taskContent2":
				if (isComplete) {
					$(":mobile-pagecontainer").pagecontainer("change", "#location", {changeHash: false});
				}
				break;
			case "map":

				if(onboarding < 3){
					ShowOnboarding();
				}else{
					$(".pop_onboard").hide();
				}
				break;
		}

	});

	$(".buttonMenu").click(function () {

		$(":mobile-pagecontainer").pagecontainer("change", "#" + this.id, {changeHash: false});

	});

	$(".buttonTheme").click(function () {
		currentTheme = this.id;
		$(":mobile-pagecontainer").pagecontainer("change", "#themeIntro", {changeHash: false});

	});

	$(".buttonLocation").click(function () {
		currentLocation = this.id.split("_")[1];
		$(":mobile-pagecontainer").pagecontainer("change", "#locationIntro", {changeHash: false});

	});

	$(".mapIcon").tap(function () {
		currentLocation = this.id.split("_")[1];
		$(":mobile-pagecontainer").pagecontainer("change", "#locationIntro", {changeHash: false});
	});

	$(".buttonIcon").click(function () {
		switch (this.id) {
			case "menu":
				$(":mobile-pagecontainer").pagecontainer("change", "#menu", {changeHash: false});
				break;
			case "back":
				goBack();
				break;
			case "zIn":
				if(pz.zoom() + 0.25 < 1.6) pz.zoom(0.25 + pz.zoom());
				break;
			case "zOut":
				if(pz.zoom() - 0.25 > 0.24) pz.zoom(pz.zoom() - 0.25);
				break;
			case "close":
				closePopups();
				onboarding = 3;
				break;
			case "taskClose":
				$(":mobile-pagecontainer").pagecontainer("change", "#location", {changeHash: false});
				break;
		}

	});

	$(".pop_question .answerBox").click(function () {
		$("audio.watkinCircle")[0].pause();
		if ($(this).children("p").text() == json.Location[currentLocation].AnswerA) {
			$(this).addClass("ansCorrect");
			playFX("correct");
			setTimeout(showAnswer, 1000);
		} else {
			playFX("wrong");
			$(this).addClass("ansWrong");
		}
	});

	$(".buttonTask").click(function () {
		currentTask = this.id.split("_")[1];
		currentTheme = json.Location[currentLocation].Activity[currentTask].Theme;
		$(":mobile-pagecontainer").pagecontainer("change", "#taskIntro", {changeHash: false});
	});

	$("audio.watkinCircle")[0].addEventListener('ended', function () {
		$("video").each(function () {
			$(this).get(0).pause();
		});
		switch ($.mobile.pageContainer.pagecontainer('getActivePage').attr('id')) {
			case "landing":
				$(".page_landing video.presenterCircle")[0].play(0);
				break;
			case "location":
				if(currentLocation < 17) $(".page_location video.presenterCircle")[0].play(0);
				break;
		}
		
	}, false);

	$("audio.audioTask")[0].addEventListener('ended', function () {
		clearInterval(interval);
		taskComplete();
	}, false);

	$(".buttonAudio").click(function () {

		$("audio.audioTask source").attr("src", "audio/Soundscape/audio_" + currentLocation  + ".mp3");
		$("audio.audioTask")[0].load();
		interval = setInterval(checkAudio, 1000);
	});

	$(".watkinCircle").click(function () {
		$("audio.watkinCircle")[0].play();
	});
	
}

function startApp() {

}

function playFX(fx){
	$("audio.audioFX source").attr("src", "audio/FX/" + fx  + ".mp3");
	$("audio.audioFX")[0].load();

}

function checkAudio(){
	if($("audio.audioTask")[0].currentTime) {
		percent = ($("audio.audioTask")[0].currentTime / $("audio.audioTask")[0].duration)*100;
		
		$(".progressBar").css("width", (percent-1) + "%");
	}
}

function goBack() {
	isBack = true;
	if (pages.length > 0) $(":mobile-pagecontainer").pagecontainer("change", "#" + pages.pop(), {changeHash: false});
	else $(":mobile-pagecontainer").pagecontainer("change", "#landing", {changeHash: false});
}

function closePopups() {
	$("audio.watkinCircle")[0].pause();
	$("audio.audioTask")[0].pause();
	$(".pop_question").hide();
	$(".pop_answer").hide();
	$(".pop_taskComplete").hide();
	$(".pop_onboard").hide();
	$(".pop_congrats").hide();
	
}

function onZoom(){
	if(pz.zoom() > 1.4){
		$("#zIn").addClass("disable");
	}else{
		$("#zIn").removeClass("disable");
	}
	if(pz.zoom() < 0.26){
		$("#zOut").addClass("disable");
	}else{
		$("#zOut").removeClass("disable");
	}
}

function showTaskList(){
	var tasks = $(".buttonTask").toArray();
	$(".buttonTask .buttonIcon").removeClass("iconDBTB iconMC iconLF iconNGU");
	for (var i = 0; i < tasks.length; i++) {
		if(json.Location[currentLocation].Activity[i]){
			$(tasks[i]).css("background-image", "url(ui/BG/" + json.Location[currentLocation].Activity[i].Type + ".png)");
			$(tasks[i]).children(".cover").children("h4").html(json.Location[currentLocation].Activity[i].Title);
			$(tasks[i]).children(".cover").children(".buttonIcon").addClass("icon" + json.Location[currentLocation].Activity[i].Theme);
			$(tasks[i]).show();
		}else{
			$(tasks[i]).hide();
		}
	}

}

function showQuestion() {
	$(".pop_question .speechBubble p").html(json.Location[currentLocation].Question);
	$(".pop_question .answerBox").removeClass("ansCorrect ansWrong");
	var answers = $(".pop_question .answerBox p").toArray();
	shuffle(answers);
	$(answers[0]).html("<br>" + json.Location[currentLocation].AnswerA);
	$(answers[1]).html("<br>" + json.Location[currentLocation].AnswerB);
	$(answers[2]).html("<br>" + json.Location[currentLocation].AnswerC);
	$(answers[3]).html("<br>" + json.Location[currentLocation].AnswerD);
	
	$("audio.watkinCircle source").attr("src", json.Location[currentLocation].QuestionAudio);
	$("audio.watkinCircle")[0].load();
	$(".pop_question video.watkinCirclePop")[0].play();
	$(".pop_question").show();

}

function showAnswer() {
	isCorrect = true;
	$(".pop_answer .speechBubble p").html(json.Location[currentLocation].Correct);
	$(".pop_answer .answerBox p").html("<br>" + json.Location[currentLocation].AnswerA);
	$(".pop_answer .buttonCTA h2").html(json.Location[currentLocation].CorrectCTA);

	$(".pop_answer video source").attr("src", json.Location[currentLocation].CorrectClip);
	$(".pop_answer video")[0].load();

	$(".pop_question").hide();
	$(".pop_answer").show();
}

function ShowOnboarding() {
	console.log("Show Onboarding " + onboarding);
	$(".pop_onboard .speechBubble h5").html(json.Onboarding[onboarding].Title);
	$(".pop_onboard .speechBubble p").html(json.Onboarding[onboarding].Body);
	$(".pop_onboard .buttonCTA h2").html(json.Onboarding[onboarding].CTA);
	$("audio.watkinCircle source").attr("src", json.Onboarding[onboarding].Audio);
	$("audio.watkinCircle")[0].load();
	$(".pop_onboard video.watkinCirclePop")[0].play();
	onboarding++;
	$(".pop_onboard").show();
}

function ShowCongrats(ind) {
	playFX("tada");
	console.log("Show Congrats " + ind);
	$(".pop_congrats .speechBubble h5").html(json.Congrats[ind].Title);
	$(".pop_congrats .speechBubble p").html(json.Congrats[ind].Body);
	$("audio.watkinCircle source").attr("src", json.Congrats[ind].Audio);
	setTimeout(loadWatkinAudio, 1500);
	
	$(".pop_congrats video.watkinCirclePop")[0].play();
	$(".pop_congrats").show();
}

function loadWatkinAudio(){
	$("audio.watkinCircle")[0].load();
}


function SetThemeBackground() {
	$(".pop_taskComplete .popup").removeClass("green pink purple lightblue dbtb_back lf_back mc_back ngu_back");
	switch (currentTheme) {
		case "DBTB":
			$("body").addClass("green dbtb_back");
			$(".pop_taskComplete .popup").addClass("green dbtb_back");
			break;
		case "LF":
			$("body").addClass("purple lf_back");
			$(".pop_taskComplete .popup").addClass("purple lf_back");
			break;
		case "MC":
			$("body").addClass("lightblue mc_back");
			$(".pop_taskComplete .popup").addClass("lightblue mc_back");
			break;
		case "NGU":
			$("body").addClass("pink ngu_back");
			$(".pop_taskComplete .popup").addClass("pink ngu_back");
			break;
	}
}

function taskComplete() {
	isComplete = true;
	$(".pop_taskComplete .speechBubble p").html(json.Location[currentLocation].Activity[currentTask].Feedback);
	$(".pop_taskComplete .buttonCTA h2").html(json.Location[currentLocation].CorrectCTA);

	$(".pop_taskComplete video source").attr("src", json.Location[currentLocation].Activity[currentTask].FeedbackClip);
	$(".pop_taskComplete video")[0].load();
	$(".themeCircleCentre").removeClass("DBTB LF MC NGU DBTB1 LF1 MC1 NGU1 DBTB2 LF2 MC2 NGU2 DBTB3 LF3 MC3 NGU3");
	var theme = "";
	var score = 0;
	switch (currentTheme) {
		case "DBTB":
			theme = "DBTB";
			if(!json.Location[currentLocation].Activity[currentTask].Complete){
				scoreDBTB++;
				json.Location[currentLocation].Activity[currentTask].Complete = true;
			}
			score = scoreDBTB;
			break;
		case "LF":
			theme = "LF";
			if(!json.Location[currentLocation].Activity[currentTask].Complete){
				scoreLF++;
				json.Location[currentLocation].Activity[currentTask].Complete = true;
			}
			score = scoreLF;
			break;
		case "MC":
			theme = "MC";
			if(!json.Location[currentLocation].Activity[currentTask].Complete){
				scoreMC++;
				json.Location[currentLocation].Activity[currentTask].Complete = true;
			}
			score = scoreMC;
			break;
		case "NGU":
			theme = "NGU";	
			if(!json.Location[currentLocation].Activity[currentTask].Complete){
				scoreNGU++;
				json.Location[currentLocation].Activity[currentTask].Complete = true;
			}
			score = scoreNGU;
			break;
	}
	console.log(theme + " " + score);
	switch (score) {
		case 0:	
			$(".themeCircleCentre").addClass(theme);
			break;
		case 1:
			$(".themeCircleCentre").addClass(theme + "1");
			break;
		case 2:	
			$(".themeCircleCentre").addClass(theme + "2");
			break;
		default:
			$(".themeCircleCentre").addClass(theme + "3");
			$(".map" + theme.toUpperCase()).addClass("done");
			break;
	}
	$(".pop_taskComplete").show();
	
}

function calculateScore() {
	$(".t_dbtb").removeClass("DBTB DBTB1 DBTB2 DBTB3");
	switch (scoreDBTB) {
		case 0:
			$(".t_dbtb").addClass("DBTB")
			$(".p_dbtb").html("Ok. Are you ready to put your mind to some fiendish tasks?");
			break;
		case 1:
			$(".t_dbtb").addClass("DBTB1")
			$(".p_dbtb").html("You've completed one task. You're thinking big. Keep going!");
			break;
		case 2:
			$(".t_dbtb").addClass("DBTB2")
			$(".p_dbtb").html("You're ace-ing this. Just one more task to complete.");
			break;
		default:
			$(".t_dbtb").addClass("DBTB3")
			$(".p_dbtb").html("Brilliant. You've done all the tasks. You are a Big Thinker!");
			break;
	}
	$(".t_lf").removeClass("LF LF1 LF2 LF3");
	switch (scoreLF) {
		case 0:
			$(".t_lf").addClass("LF")
			$(".p_lf").html("Ready for the tasks ahead? Let's get going. No looking back!");
			break;
		case 1:
			$(".t_lf").addClass("LF1")
			$(".p_lf").html("You've completed one task. What's the next one going to be?");
			break;
		case 2:
			$(".t_lf").addClass("LF2")
			$(".p_lf").html("Almost there. Keep looking ahead. The end is in sight!");
			break;
		default:
			$(".t_lf").addClass("LF3")
			$(".p_lf").html("Impressive! You've done it. You are future-focused! Nice work!");
			break;
	}
	$(".t_mc").removeClass("MC MC1 MC2 MC3");
	switch (scoreMC) {
		case 0:
			$(".t_mc").addClass("MC")
			$(".p_mc").html("Let's get this rolling. Hop on board and try some tasks. ");
			break;
		case 1:
			$(".t_mc").addClass("MC1")
			$(".p_mc").html("Great. You're part way there. Stay on track with another task.");
			break;
		case 2:
			$(".t_mc").addClass("MC2")
			$(".p_mc").html("Keep going. One more stop and you're there.");
			break;
		default:
			$(".t_mc").addClass("MC3")
			$(".p_mc").html("You've done it! You've reached the destination! Well done.");
			break;
	}
	$(".t_ngu").removeClass("NGU NGU1 NGU2 NGU3");
	switch (scoreNGU) {
		case 0:
			$(".t_ngu").addClass("NGU")
			$(".p_ngu").html("Go on, have a try. And if at first you don't succeed - try again!");
			break;
		case 1:
			$(".t_ngu").addClass("NGU1")
			$(".p_ngu").html("You are good at this! Don't stop here. Try another task.");
			break;
		case 2:
			$(".t_ngu").addClass("NGU2")
			$(".p_ngu").html("Stick at it! One more task and you've done it!");
			break;
		default:
			$(".t_ngu").addClass("NGU3")
			$(".p_ngu").html("Excellent! You made it to the end. You didn't give up.");
			break;
	}
}

function SetTask(){
	switch(locTask){
		case "0.0":
			$(".page_taskContent").html("<div class='backTask'>/ <div class='buttonIcon iconClose' id='closeTask'></div> <video class='watkinCirclePop' playsinline autoplay loop> <source src='video/Watkin_yellow.mp4' type='video/mp4'> </video> <img src='ui/White question start.svg' alt='speach start' class='speechStart'> <div class='speechBubble white'> <p>Here are some different types of sea wall to help you build your sand wall. You could try all three and see which one is best!</p> </div> <div class='speechBubble2 white rot5A'> <h6>1 Vertical</h6> <p>This type of sea wall has a flat front facing the sea and is banked up at the back.</p> </div> <div class='speechBubble2 white rot5'> <h6>2 Embankment</h6> <p>This one has mounds on both sides to help support the wall.</p> </div> <div class='speechBubble2 white rot5A'> <h6>3 Irregular</h6> <p>This is made from big pieces, usually stacked low at the front and high at the back. Hint: you could use rocks, shells or driftwood in this wall as well as sand!</p> </div> <div class='speechBubble2 white rot5'> <p> When your sand wall is complete, why not take a picture and share it to your...er...socials? Use the #WatkinWall hashtag to see what others have made.<br><br>How long do you think your sand wall will last? Have a guess. Or start the timer on your phone and see how long it takes before it's washed away. Stop the timer when it's all gone.<br><br>I implore you, though, to watch out for the tide! The sea rushes in very quickly here. </p> </div> <div class='buttonCTA blue'> <h2 class='whiteT'>I did it!</h2> </div> </div>")
		break;
		case "0.1":
			$(".page_taskContent").html("<div class='cameraView'></div> <div class='arOverlay'> <div class='backTask'> <div class='buttonIcon iconClose' id='closeTask'></div> </div> </div>");
		break;
		case "2.0":
			$(".page_taskContent").html("<div class='cameraView'></div> <div class='arOverlay'> <div class='backTask'> <div class='buttonIcon iconClose' id='closeTask'></div> </div> </div>");
		break;
		case "2.1":
			$(".page_taskContent").html("<div class='backTask'> <div class='buttonIcon iconClose' id='closeTask'></div> <video class='watkinCirclePop' playsinline autoplay loop> <source src='video/Watkin_yellow.mp4' type='video/mp4'> </video> <img src='ui/White question start.svg' alt='speach start' class='speechStart'> <div class='speechBubble white'> <p>Find a square or rectangular piece of paper. You can use any paper that you can easily fold and cut. Tracing paper or tissue paper is ideal. It doesn't have to be white - you can try different colours. You can use fabric too, as long as you can cut it with scissors.</p> </div> <div class='speechBubble2 white rot5A'> <img src='ui/Task/Snowflake/1.svg' alt='instruction' class='instructionImage'> <h6>1.</h6> <p>Fold one corner up across to form a right triangle.</p> <div class='clear'></div> </div> <div class='speechBubble2 white rot5'> <img src='ui/Task/Snowflake/2.svg' alt='instruction' class='instructionImage'> <h6>2.</h6> <p>Trim the excess paper from the top.</p> <div class='clear'></div> </div> <div class='speechBubble2 white rot5A'> <img src='ui/Task/Snowflake/3.svg' alt='instruction' class='instructionImage'> <h6>3.</h6> <p>Fold the bottom corner up along the folded edge.</p> <div class='clear'></div> </div> <div class='speechBubble2 white rot5'> <img src='ui/Task/Snowflake/4.svg' alt='instruction' class='instructionImage'> <h6>4.</h6> <p>Fold the triangle in half with folded edges together</p> <div class='clear'></div> </div> <div class='speechBubble2 white rot5A'> <img src='ui/Task/Snowflake/5.svg' alt='instruction' class='instructionImage'> <h6>5.</h6> <p>Fold the folded edge across to form a cone.</p> <div class='clear'></div> </div> <div class='speechBubble2 white rot5'> <img src='ui/Task/Snowflake/6.svg' alt='instruction' class='instructionImage'> <h6>6.</h6> <p>Trim excess paper from the top.</p> <div class='clear'></div> </div> <div class='speechBubble2 white rot5A'> <img src='ui/Task/Snowflake/7.svg' alt='instruction' class='instructionImage'> <h6>7.</h6> <p>Cut shapes from each folded side, cutting all the way from one side to the other ONLY at the top and bottom.</p> <div class='clear'></div> </div> <div class='speechBubble2 white rot5'> <img src='ui/Task/Snowflake/8.svg' alt='instruction' class='instructionImage'> <h6>8.</h6> <p>Carefully open out your snowflake. You can iron it to make it nice and flat. Voila! You have made a snowflake.<br><br>Don't forget to put the waste paper in the recycling!</p> <div class='clear'></div> </div> <div class='buttonCTA blue'> <h2 class='whiteT'>Let it snow!</h2> </div> </div>");
		break;
		case "4.0":
			$(".page_taskContent").html("<div class='cameraView'></div> <div class='arOverlay'> <div class='backTask'> <div class='buttonIcon iconClose' id='closeTask'></div> </div> </div>");
		break;
		case "5.1":
			$(".page_taskContent").html("<div class='backTask'> <div class='buttonIcon iconClose' id='closeTask'></div> <video class='watkinCirclePop' playsinline autoplay loop> <source src='video/Watkin_yellow.mp4' type='video/mp4'> </video> <img src='ui/White question start.svg' alt='speach start' class='speechStart'> <div class='speechBubble white'> <p>Your task for this location is to think of a story about some of these people. You could make notes on your phone, or if you've got any paper, you could even write it down! Here are some prompts to help you get started.</p> </div> <div class='speechBubble2 white rot5A'> <h6>1. Fisher</h6> <p>A fisher is waiting to go on leave after being at sea for two weeks. They are tired and dirty.</p> </div> <div class='speechBubble2 white rot5'> <h6>2. Pier worker</h6> <p>They have been hard at work loading and unloading cargo from the pier. All they want is to get home and put their feet up!</p> </div> <div class='speechBubble2 white rot5A'> <h6>3. Long journey</h6> <p>This person is seeking a better life in America. They came all the way from Europe and arrived in Cleethorpes at the pier. The train is the next step on their very long journey.</p> </div> <div class='speechBubble2 white rot5'> <h6>4. Holidays</h6> <p>A young family have just had their first bank holiday weekend at Cleethorpes. Did they have fun?</p> </div> <div class='buttonCTA blue'> <h2 class='whiteT'>Completed my story!</h2> </div> </div>");
		break;
		case "6.1":
			$(".page_taskContent").html("<div class='backTask'> <div class='buttonIcon iconClose' id='closeTask'></div> <div class='cardGame'> <div class='card'> <div class='cardFront task6 p1'> <div class='cardBack '></div> </div> </div> <div class='card'> <div class='cardFront task6 p2'> <div class='cardBack'></div> </div> </div> <div class='card'> <div class='cardFront task6 p3'> <div class='cardBack'></div> </div> </div> <div class='card'> <div class='cardFront task6 p4'> <div class='cardBack'></div> </div> </div> <div class='card'> <div class='cardFront task6 p5'> <div class='cardBack'></div> </div> </div> <div class='card'> <div class='cardFront task6 p6'> <div class='cardBack'></div> </div> </div> <div class='card'> <div class='cardFront task6 p7'> <div class='cardBack'></div> </div> </div> <div class='card'> <div class='cardFront task6 p8'> <div class='cardBack'></div> </div> </div> <div class='card'> <div class='cardFront task6 p1'> <div class='cardBack'></div> </div> </div> <div class='card'> <div class='cardFront task6 p2'> <div class='cardBack'></div> </div> </div> <div class='card'> <div class='cardFront task6 p3'> <div class='cardBack'></div> </div> </div> <div class='card'> <div class='cardFront task6 p4'> <div class='cardBack'></div> </div> </div> <div class='card'> <div class='cardFront task6 p5'> <div class='cardBack'></div> </div> </div> <div class='card'> <div class='cardFront task6 p6'> <div class='cardBack'></div> </div> </div> <div class='card'> <div class='cardFront task6 p7'> <div class='cardBack'></div> </div> </div> <div class='card'> <div class='cardFront task6 p8'> <div class='cardBack'></div> </div> </div> </div> </div>");
			initPairs();
			break;
		case "7.0":
			$(".page_taskContent").html("<video class='cameraView' id='camera' playsinline autoplay></video><div class='glassOverlay'> <div class='backTask'> <div class='buttonIcon iconClose iRotate' id='closeTask'></div> </div> </div>");
			initGlass();
			break;
		case "8.0":
			$(".page_taskContent").html("<div class='backTask'> <div class='buttonIcon iconClose' id='closeTask'></div> <video class='watkinCirclePop' playsinline autoplay loop> <source src='video/Watkin_yellow.mp4' type='video/mp4'> </video> <img src='ui/White question start.svg' alt='speach start' class='speechStart'> <div class='speechBubble white'> <p>Here are some instructions to find the right place to view the images. I'm here to help!<br><br>When you're in the right place, use the 'I'm ready' button to see the image from the past.</p> </div> <div class='speechBubble2 white rot5A'> <h6>1. Move to Ross Castle</h6> <p>Take care when crossing any roads!</p> </div> <div class='speechBubble2 white rot5'> <h6>2. Walk to the top of Ross Castle</h6> <p>The sea should be on your right</p> </div> <div class='speechBubble2 white nopad rot5A'> <img src='ui/ar/Cliff/guide.png' alt='guide image' class='guideImage'> </div> <div class='speechBubble2 white rot5'> <h6>3. Check your position</h6> <p>If your view looks like the one pictured, then you're ready! Touch the button to continue.</p> </div> <div class='buttonCTA blue'> <h2 class='whiteT'>I'm ready!</h2> </div> </div>");
			$(".page_taskContent2").html("<div class='cameraView'></div> <div class='cameraGuide task8'> <div class='cameraOld task8'></div> </div> <div class='arOverlay'> <div class='backTask'> <div class='buttonIcon iconClose iRotate' id='closeTask'></div> </div> </div>");
			break;
		case "9.0":
			$(".page_taskContent").html("<div class='backTask'> <div class='buttonIcon iconClose' id='closeTask'></div> <div class='backPelican'> <div class='pelican open'></div> </div> <div class='basketFood'> <div class='food food1'></div> <div class='food food2'></div> <div class='food food3'></div> <div class='food food4'></div> <div class='food food5'></div> <div class='food food6'></div> <div class='food food7'></div> </div> </div>");
		break;
		case "11.0":
			$(".page_taskContent").html("<div class='backTask'> <div class='buttonIcon iconClose' id='closeTask'></div> <div class='fishingBack'> <div class='scoreBar pink'> <div class='scoreLeft'> <h2>Your score:</h2> <h1>00</h1> </div> <div class='scoreCentre'> <div class='clock'></div> </div> <div class='scoreRight'> <h2>Time remaining:</h2> <h1>30</h1> </div> </div> <div class='fishingContainer'> <div class='fishingIcon fish1'></div> <div class='fishingIcon fish2'></div> <div class='fishingIcon fish3'></div> <div class='fishingIcon fish4'></div> <div class='fishingIcon fish1 sm'></div> <div class='fishingIcon fish2 sm'></div> <div class='fishingIcon fish3 sm'></div> <div class='fishingIcon fish4 sm'></div> </div> </div> </div>");
		break;
		case "12.0":
			$(".page_taskContent").html("<div class='backTask'> <div class='buttonIcon iconClose' id='closeTask'></div> <div class='cardGame'> <div class='card'> <div class='cardFront task12 p1'> <div class='cardBack '></div> </div> </div> <div class='card'> <div class='cardFront task12 p2'> <div class='cardBack'></div> </div> </div> <div class='card'> <div class='cardFront task12 p3'> <div class='cardBack'></div> </div> </div> <div class='card'> <div class='cardFront task12 p4'> <div class='cardBack'></div> </div> </div> <div class='card'> <div class='cardFront task12 p5'> <div class='cardBack'></div> </div> </div> <div class='card'> <div class='cardFront task12 p6'> <div class='cardBack'></div> </div> </div> <div class='card'> <div class='cardFront task12 p7'> <div class='cardBack'></div> </div> </div> <div class='card'> <div class='cardFront task12 p8'> <div class='cardBack'></div> </div> </div> <div class='card'> <div class='cardFront task12 p1'> <div class='cardBack'></div> </div> </div> <div class='card'> <div class='cardFront task12 p2'> <div class='cardBack'></div> </div> </div> <div class='card'> <div class='cardFront task12 p3'> <div class='cardBack'></div> </div> </div> <div class='card'> <div class='cardFront task12 p4'> <div class='cardBack'></div> </div> </div> <div class='card'> <div class='cardFront task12 p5'> <div class='cardBack'></div> </div> </div> <div class='card'> <div class='cardFront task12 p6'> <div class='cardBack'></div> </div> </div> <div class='card'> <div class='cardFront task12 p7'> <div class='cardBack'></div> </div> </div> <div class='card'> <div class='cardFront task12 p8'> <div class='cardBack'></div> </div> </div> </div> </div>");
			initPairs();
			break;
		case "13.0":
			$(".page_taskContent").html("<div class='backTask'> <div class='buttonIcon iconClose' id='closeTask'></div> <video class='watkinCirclePop' playsinline autoplay loop> <source src='video/Watkin_yellow.mp4' type='video/mp4'> </video> <img src='ui/White question start.svg' alt='speach start' class='speechStart'> <div class='speechBubble white'> <p>Here are some instructions to find the right place to view the images. I'm here to help!<br><br>When you're in the right place, use the 'I'm ready' button to see the image from the past.</p> </div> <div class='speechBubble2 white rot5A'> <h6>1. Move to the car park</h6> <p>Take care when crossing any roads!</p> </div> <div class='speechBubble2 white rot5'> <h6>2. Face the rear of the leisure centre</h6> <p>The sea should be on your right</p> </div> <div class='speechBubble2 white nopad rot5A'> <img src='ui/ar/Pool/guide.png' alt='guide image' class='guideImage'> </div> <div class='speechBubble2 white rot5'> <h6>3. Check your position</h6> <p>If your view looks like the one pictured, then you're ready! Touch the button to continue.</p> </div> <div class='buttonCTA blue'> <h2 class='whiteT'>I'm ready!</h2> </div> </div>");
			$(".page_taskContent2").html("<div class='cameraView'></div> <div class='cameraGuide task13'> <div class='cameraOld task13'></div> </div> <div class='arOverlay'> <div class='backTask'> <div class='buttonIcon iconClose iRotate' id='closeTask'></div> </div> </div>");
			break;
		case "14.1":
			$(".page_taskContent").html("<div class='backTask'> <div class='buttonIcon iconClose' id='closeTask'></div> <video class='watkinCirclePop' playsinline autoplay loop> <source src='video/Watkin_yellow.mp4' type='video/mp4'> </video> <img src='ui/White question start.svg' alt='speach start' class='speechStart'> <div class='speechBubble white'> <p>I think a good boat should do two things: stay afloat, and sail a long way.<br /><br />Follow the instructions below or make your own.</p> </div> <div class='speechBubble2 white rot5A'> <img src='ui/Task/Boat/paper 01.svg' alt='instruction' class='instructionImage'> <h6>1</h6> <p>Start with a rectangular piece of paper, coloured side up. Fold in half, then open.</p> <div class='clear'></div> </div> <div class='speechBubble2 white rot5'> <img src='ui/Task/Boat/paper 02.svg' alt='instruction' class='instructionImage'> <h6>2</h6> <p>Fold in half downwards.</p> <div class='clear'></div> </div> <div class='speechBubble2 white rot5A'> <img src='ui/Task/Boat/paper 03.svg' alt='instruction' class='instructionImage'> <h6>3</h6> <p>Bring corners in to centre line.</p> <div class='clear'></div> </div> <div class='speechBubble2 white rot5'> <img src='ui/Task/Boat/paper 04.svg' alt='instruction' class='instructionImage'> <h6>4</h6> <p>Fold uppermost layer upwards and do the same to the back. Crease well.</p> <div class='clear'></div> </div> <div class='speechBubble2 white rot5A'> <img src='ui/Task/Boat/paper 05.svg' alt='instruction' class='instructionImage'> <h6>5</h6> <p>Pull the sides out and flatten.</p> <div class='clear'></div> </div> <div class='speechBubble2 white rot5'> <img src='ui/Task/Boat/paper 06.svg' alt='instruction' class='instructionImage'> <h6>6</h6> <p>Fold front layer up to top, and do the same to the back.</p> <div class='clear'></div> </div> <div class='speechBubble2 white rot5A'> <img src='ui/Task/Boat/paper 07.svg' alt='instruction' class='instructionImage'> <h6>7</h6> <p>Pull the sides outwards and flatten.</p> <div class='clear'></div> </div> <div class='speechBubble2 white rot5'> <img src='ui/Task/Boat/paper 08.svg' alt='instruction' class='instructionImage'> <h6>8</h6> <p>Gently pull the top parts of the model outwards, making a boat shape.</p> <div class='clear'></div> </div> <div class='speechBubble2 white rot5A'> <img src='ui/Task/Boat/paper 09.svg' alt='instruction' class='instructionImage'> <h6>9</h6> <p>Flatten well to crease all folds. Then open out slightly, forming a boat shape.</p> <div class='clear'></div> </div> <div class='buttonCTA blue'> <h2 class='whiteT'>Sail your boats!</h2> </div> </div>");
		break;
		case "15.1":
			$(".page_taskContent").html("<div class='backTask'> <div class='buttonIcon iconClose' id='closeTask'></div> <video class='watkinCirclePop' playsinline autoplay loop> <source src='video/Watkin_yellow.mp4' type='video/mp4'> </video> <img src='ui/White question start.svg' alt='speach start' class='speechStart'> <div class='speechBubble white'> <p>Your task for this location is to design a recycling sculpture. Think about what it would look like and what it's made from. Then describe it. If you've got any paper to hand, you could even draw it!<br><br>To help you get started, I've written some prompts.</p> </div> <div class='speechBubble2 white rot5A'> <h6>1. Shape</h6> <p>What shape or form would it take? For example, would it be a giant drink can? Or perhaps an animal like a dolphin or an octupus?</p> </div> <div class='speechBubble2 white rot5'> <h6>2. Material</h6> <p>What would it be made from? For example, would it be wood? If not, why not? Or maybe metal or plastic? </p> </div> <div class='speechBubble2 white rot5A'> <h6>3. Contents</h6> <p>What would you be able to put in your recycling bin? What would you not allow, and why?</p> </div> <div class='speechBubble2 white rot5'> <h6>4. Location</h6> <p>Where would you put your recycling bin? What would be the best place to attract the most rubbish? </p> </div> <div class='speechBubble2 white rot5A'> <h6>5. Can you draw it?</h6> <p>Then you could post it to your socials.<br /><br />Good luck!</p> </div> <div class='buttonCTA blue'> <h2 class='whiteT'>I've designed it!</h2> </div> </div>");
		break;
		default:
			$(".page_taskContent").html("");
		break;
	}

	$(".page_taskContent .buttonCTA").click(function () {
		switch(locTask){
			case "8.0":
			case "13.0":
				$(":mobile-pagecontainer").pagecontainer("change", "#taskContent2", {changeHash: false});
			break;
			default:
				taskComplete();
			break;
		}
	});

	$(".page_taskContent .buttonIcon").click(function () {
		switch(locTask){
			case "0.1":
			case "2.0":
			case "4.0":
			case "7.0":
				taskComplete();
			break;
			default:
				goBack();
			break;
		}
	});

	$(".page_taskContent2 .buttonIcon").click(function () {
		taskComplete();
	});
}

function initGlass(){
	$(".glassOverlay").hide();
	if(navigator && navigator.mediaDevices){
    	const options = { audio: false, video: { facingMode: "user", width: 200, height: 200  } }
		navigator.mediaDevices.getUserMedia(options)
		.then(function(stream) {
			var video = document.getElementById('camera');
			video.srcObject = stream;
			video.onloadedmetadata = function(e) {
			video.play();
			};
		})
		.catch(function(err) {
			//Handle error here
		});
	}else{
		console.log("camera API is not supported by your browser")
	}
}

function initPairs(){
	gameCount = 0;
	gameScore = 0;
	gameData = "";
	$(".cardFront").removeClass("p1 p2 p3 p4 p5 p6 p7 p8")
	var cards = $(".card").toArray();
	shuffle(cards);
	var cnt = 1;
	for(var a = 0; a < cards.length; a++){
		$(cards[a]).children(".cardFront").addClass("p"+cnt);
		$(cards[a]).attr("id","p"+cnt);
		cnt++
		if(cnt > 8) cnt = 1;
	}

	$(".card").click(function () {
		if($(this).hasClass(".selected") == false && $(this).hasClass(".correct") == false){
			$(".card.incorrect").find(".cardBack").show();
			$(".card").removeClass("incorrect");
			$(this).addClass("selected")
			$(this).find(".cardBack").hide();
			if(gameData == ""){
				gameData = $(this).attr("id");

			}else{
				if(this.id == gameData){
					gameScore++;
					$(".card.selected").addClass("correct");
					playFX("correct");
				}else{
					$(".card.selected").addClass("incorrect");
					playFX("wrong");
				}
				gameData = "";
				$(".card").removeClass("selected");
				if(gameScore == 8){
					setTimeout(taskComplete, 1000);
				}
			}
		}
		
	});
}

function startCompass() {
  if (isIOS()) {
    DeviceOrientationEvent.requestPermission()
      .then((response) => {
        if (response === "granted") {
          window.addEventListener("deviceorientation", handler, true);
        } else {
          //alert("Device orientation has to be allowed!");
        }
      })
      .catch(() => alert("Device orientation not supported"));
  } else {
    window.addEventListener("deviceorientationabsolute", handler, true);
  }
}

function handler(e) {
	if(currentPage == "map"){
		compass = e.webkitCompassHeading || Math.abs(e.alpha - 360);
  		//alert("Compass heading: " + compass);
 		 //$(".compassPoint").style.transform = `translate(-50%, -50%) rotate(${-compass}deg)`;
		 $(".compassPoint").css("rotate", compass + "deg");
		 getLocation();
	}
  
}

function getLocation() {
  if (navigator.geolocation) {
	$(".meIcon").show();
    navigator.geolocation.watchPosition(showPosition, error);
  } else {
    $(".meIcon").hide();
  }
}

function showPosition(position) {
	if(currentPage == "map"){
		if(position.coords.latitude > 53.553611 && position.coords.latitude < 53.557222 && position.coords.longitude > -0.045556 && position.coords.longitude < -0.001389){
			var lat =  (53.553611 - position.coords.latitude)*1134311.82;
			$(".compassPoint").css("left", lat + "px");

			var lon =  (-0.045556 -position.coords.longitude)*92738.92;
			$(".compassPoint").css("top", lon + "px");

		}
		
	}
  
}

function error() {
  $(".meIcon").hide();
}

function isIOS() {
  return [
    'iPad Simulator',
    'iPhone Simulator',
    'iPod Simulator',
    'iPad',
    'iPhone',
    'iPod'
  ].includes(navigator.platform)
  // iPad on iOS 13 detection
  || (navigator.userAgent.includes("Mac") && "ontouchend" in document)
}


function shuffle(array) {
	let currentIndex = array.length;

	// While there remain elements to shuffle...
	while (currentIndex != 0) {

		// Pick a remaining element...
		let randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex--;

		// And swap it with the current element.
		[array[currentIndex], array[randomIndex]] = [
			array[randomIndex], array[currentIndex]];
	}
}
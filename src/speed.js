// Speed
// by Ben Crowder


var remote = require('remote');

// Create session object
function SpeedSession() {
	// Total time in seconds
	this.totalTime = 0;

	// Target word count
	this.targetWordCount = 0;

	// Time left in seconds
	this.timeLeft = 0;

	// Current word count
	this.currentWordCount = 0;

	// Interval ID
	this.intervalId = -1;

	// Paused state
	this.paused = false;

	// Get current word count
	this.getWordCount = function() {
		var text = $("textarea#content").val().trim();
		text = text.replace("\n", " ").replace("  ", " ").trim();

		var words = text.split(/\s+/);

		// Edge case for initial
		if (words.length == 1 && words[0] == "") {
			this.currentWordCount = 0;
		} else {
			this.currentWordCount = words.length;
		}
	};

	// Start session timer
	this.start = function() {
		this.timeLeft = this.totalTime;
		this.currentWordCount = 0;

		var t = this;
		this.intervalId = setInterval(function() {
			t.update(t);
		}, 1000);
	};

	// Stop session timer
	this.stopTimer = function() {
		clearInterval(this.intervalId);
	};

	// Update each second
	this.update = function(that) {
		if (!that.paused) {
			// Decrement timer
			that.timeLeft--;

			// Get the current word count
			that.getWordCount();

			if (that.timeLeft <= 0) {
				// Overtime
				$("body").addClass("overtime");

				// Stop the timer
				this.stopTimer();
			}

			// Update the UI
			var wordsLeft = that.targetWordCount - that.currentWordCount;
			$("#words-status").html("<span>" + that.currentWordCount + "</span> words <span>" + wordsLeft + "</span> left");
			$("#time-left").html(toMMSS(String(that.timeLeft)));
		}
	};

	// Start session
	this.startSession = function(that) {
		that.totalTime = Math.ceil(parseFloat($("input[name=minutes]").val()) * 60.0);
		that.targetWordCount = parseInt($("input[name=words]").val());

		// Set timer
		that.start();

		$("body").addClass("active").removeClass("overtime");

		// Clear out textarea
		$("textarea#content").val('').attr("disabled", false);
		
		// Update UI
		$("#words-status").html("<span>0</span> words <span>" + that.targetWordCount + "</span> left");
		$("#time-left").html(toMMSS(String(that.totalTime)));

		// Hide initial controls
		$(".initial").slideUp(100, function() {
			$(".main").slideDown(100, function() {
				$(".main").css('display', 'flex');

				// Focus on textarea
				$("textarea#content").focus();
			});
		});

		return false;
	};

	// Stop session
	this.stopSession = function(that) {
		// Clear the interval
		that.stopTimer();

		// Hide display controls
		$(".main").slideUp(100, function() {
			$(".initial").slideDown(100);
		});

		$("body").removeClass("active").removeClass("overtime");
		$("textarea#content").attr("disabled", true);

		return false;
	};

	// Pause session
	this.pauseSession = function(that) {
		that.paused = !that.paused;

		if (that.paused) {
			$("body").addClass("paused");
			$("#pause-button").html("&#9658;").addClass("paused");
		} else {
			$("body").removeClass("paused");
			$("#pause-button").html("&#9612;&#9612;").removeClass("paused");
		}

		return false;
	};

	return false;
}

var speedSession = new SpeedSession();


// Handlers
$("#start-button").on("click", function() { speedSession.startSession(speedSession); return false; });
$("#pause-button").on("click", function() { speedSession.pauseSession(speedSession); return false; });
$("#stop-button").on("click", function() { speedSession.stopSession(speedSession); return false; });


// Display number of seconds as minutes:seconds
function toMMSS(seconds) {
    var sec_num = parseInt(seconds, 10); // don't forget the second param
    var hours   = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60);

    if (seconds < 10) { seconds = "0" + seconds; }

    var time = minutes + ':' + seconds;

    return time;
}


// On app start, focus on the words textbox
$("input[name=words]").focus();


// Keyboard shortcuts
$("textarea").on("keydown", function(e) {
	var isShift = !!e.shiftKey;

	if (e.keyCode == 13 && isShift) {
		// Shift+enter = toggle
		speedSession.pauseSession(speedSession);

		// And don't actually add a newline
		return false;
	}
});

$(".initial input[type=text]").on("keypress", function(e) {
	if (e.which == 13) {
		$(this).blur();

		// Start session
		speedSession.startSession(speedSession);
	}
});

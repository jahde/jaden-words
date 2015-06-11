// Set bounce animation speed
var bounceSpeed = 7;

/* Ball Bouncing On Text © Yogev Ahuvia
 * ===========================================
 * This bouncing ball jumps over the words
 * inside the contentEditable paragraph.
 * The text itself is editable, the jump speed
 * is dynamic, and the ball bounce animation
 * duration is set by the length of each word.
 *
 * Have you tried switching off the light? :)
 * -------------------------------------------
 * Works best on Google Chrome.
 */

var Bouncer = function(elem) {
  // init bouncable element and helpers
  this.$elem = $(elem);
  this.$ball = $('<div class="ball"></div>');
  this.$space = $('<span>&nbsp;</span>');
  this.timers = [];

  // handle in-place editing events
  this.$elem.on('blur', (function(instance) {
    return function() {
      instance.init();
      instance.bounce();
    };
  })(this));

  this.$elem.on('keypress', function(e) {
    var code = (e.keyCode ? e.keyCode : e.which);
    if (code == 13) {
      $(this).blur();
    }
  });

  // make it bounce
  var self = this;
  this.init(self);
  this.bounce(self);
};

Bouncer.prototype.init = function(self) {
  // get element text for parsing
  this.elemText = this.$elem.text();

  // clone element for new text injection
  this.$cloned = this.$elem.clone()
                           .empty()
                           .addClass('cloned')
                           .removeAttr('contenteditable')
                           .appendTo(this.$elem.parent());

  // handle cloned element termination
  this.$cloned.on('click', (function(instance) {
    return function() {
      instance.reset();
      instance.$elem.focus();
      document.execCommand('selectAll', false, null);
    };
  })(this));

  this.$elem.hide(); // hide original element while animating
  this.$ball.appendTo(this.$cloned); // add ball to new element
  this.contentArray = this.elemText.split(' ');
};

Bouncer.prototype.bounce = function(self) {
  // ball animation incrementing delay
  var incrementingDelay = 0;

  // run through the text
  for (var j = 0; j < this.contentArray.length; j++) {
    var word = this.contentArray[j];

    // handle multiple spaces
    if (/\s/g.test(word)) {
      this.$space.clone().appendTo(this.$cloned);
      this.contentArray.splice(j, 1);
      j--;
      continue;
    }

    // escape each word with a span, add it to cloned element
    var $word = $('<span class="word">' + word + '</span>');
    this.$cloned.append($word);
    var wordLength = $word.width();

    // add white space elements between words
    if (j+1 < this.contentArray.length) {
      this.$space.clone().appendTo(this.$cloned);
    }

    // get ball position above word
    var ballLeft = $word[0].offsetLeft + wordLength/2;
    var ballTop = $word[0].offsetTop;

    var ballProps = {left: ballLeft,
                     top: ballTop,
                     wordLength: wordLength,
                     wordIndex: j};

    // preset timers for the whole text
    var timer = setTimeout((function(instance, ballProps) {
      return function() {
        instance.animateBall(ballProps);
      };
    })(this, ballProps), incrementingDelay);
    this.timers.push(timer);

    incrementingDelay += wordLength * bounceSpeed;
  }

  // hide ball when finished bouncing
  var timer = setTimeout((function(instance) {

    return function() {
      instance.$ball.fadeOut();

      if($('#artist').css("background-image")==="url(https://unsplash.it/2500/1600?random)") {
        $('#artist').css("background-image", "url(https://unsplash.it/2400/1600?random)");
      }
      else{
        $('#artist').css("background-image", "url(https://unsplash.it/2500/1600?random)");
      }

      var tweets = ["I Saw Owen Wilson One Time From A Distance And We Just Stared At Each Other, Then His Car Drove Off.", "I Really Dislike When All The Pretty Girls Hangout At Once • • • #CauseImNeverThere", "Yeah Your Girl Is Bad But She Doesn't Smile.","I Would Like To Remind You Guys That I Designed My Very Own Musical App Platform And Released My Debut Album For Free.", "When You Stop Texting Her Cause You Like Her Too Much.","Yeah Whatever Your Still Not As Cool As North.", "Instagram Is A BlackHole Of Time And Energy.","Just Finished Building My New Bed.", "That Moment When Your Wearing A Dress With No Pants And You Swerve Way To Hard.","That Moment When You Can't Sleep Soo You Start Doing Math.", "When Life Gives You Big Problems, Just Be Happy You Forgot All Your Little Problems.","That Moment When Peeing Feels So Good You Start Crying.", "Just Stare In The Mirror And Cry And You'll Be Good. 👍","A Little Girl Just Asked Me If I Was Willow Smith I Humbly Said Yes And Took A Selfie.", "Yeah Yeah, But How Many Pull Ups Can You Do.", "The More Time You Spend Awake The More Time You Spend Asleep.", "Relationships Are Messed Up But Your Face Isn't.", "I Don't Smell Good, But I Don't Smell Bad You Feel Me.","It's Okay To Cry Guys.", "I'm To Emotional For All That Relationship Stuff.","Don't Worry Bae I'll Talk To You About SpaceTime Over FaceTime.", "I Just Like Showing Pretty Girls A Good Time Weather I'm Physically There Or Not Doesn't  Matter.","I'm Glad That Our Distance Makes Us Witness Ourselves From A Different Entrance.", "Female Energy","Haters Are Just Pre Creators Who Need The Seed Of Greatness.", "When She's So Fine That You See A Picture And Immediately Start Doing Push Up."]

      for (i = 0; i <4; i++) {
        var random = tweets[Math.floor(Math.random()*tweets.length)]
        $('#bouncer-text').text(random);
        self.reset();
        self.init();
        self.bounce();
      }

      // debugger;
      // var random = tweets[Math.floor(Math.random()*tweets.length)]
      // $('#bouncer-text').text(random);
      // self.reset();
      // self.init();
      // self.bounce();

      // debugger;
      // var random = tweets[Math.floor(Math.random()*tweets.length)]
      // $('#bouncer-text').text(random);
      // self.reset();
      // self.init();
      // self.bounce();
    };
  })(this), incrementingDelay);
  this.timers.push(timer);
}

Bouncer.prototype.animateBall = function(ballProps) {

  // set ball transition duration per word length
  var leftDuration = ballProps.wordLength * bounceSpeed + 'ms';
  var topDuration = (ballProps.wordLength * bounceSpeed / 2) + 'ms';
  this.$ball.css('transition-duration',
                 leftDuration + ', ' + topDuration);

  // animate ball halfway and up
  var ballOffsetLeft = this.$ball[0].offsetLeft;
  var delta = ballProps.left - ballOffsetLeft;
  var ballHalfWay = ballOffsetLeft + delta;
  this.$ball.css({'left': ballHalfWay + 'px',
                  'top': '-50px'});

  // finish animation when the ball reach halfway
  var halfwayReached = ballProps.wordLength * bounceSpeed / 2;
  var timer = setTimeout((function(instance, ballProps) {
    return function() {

      // animate ball to finish the bounce
      instance.$ball.css({'left': ballProps.left + 'px' ,
                          'top': '0px'});

      // light the bounced word when the ball bounces on it
      var bouncedOnWord = ballProps.wordLength * bounceSpeed / 2;
      var timer = setTimeout((function(instance, ballProps) {
        return function() {
          instance.$cloned
                  .find('.word')
                  .eq(ballProps.wordIndex)
                  .addClass('lit');
        };
      })(instance, ballProps), bouncedOnWord);
      instance.timers.push(timer);
    };
  })(this, ballProps), halfwayReached);
  this.timers.push(timer);
}

Bouncer.prototype.reset = function() {
  for (var i = 0; i < this.timers.length; i++) {
    clearTimeout(this.timers[i]);
  }
  this.timers.length = 0;

  this.$elem.show();
  this.$cloned.remove();
  this.$ball.removeAttr('style');
}

var bouncers = [];
$(document).ready(function() {
  // make all 'bouncer' classes, bounce
  $('.bouncer').each(function(index, element) {
    bouncers.push(new Bouncer(element));
  });;

  // handle light switch
  $('.light-switch').on('click', function() {
    $('body').toggleClass('dark');

    for (var i = 0; i < bouncers.length; i++) {
      bouncers[i].reset();
      bouncers[i].init();
      bouncers[i].bounce();
    }
  });

  // show hint
  $('.hint').removeClass('preload');
  setTimeout(function() {
    $('.hint').addClass('open');
    setTimeout(function() {
      $('.hint').removeClass('open');
    }, 4000);
  }, 6000);
});

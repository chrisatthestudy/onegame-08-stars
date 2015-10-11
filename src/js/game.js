/*
 * =============================================================================
 * To The Stars
 * =============================================================================
 * August game for One Game A Month
 *
 * (c) 2013 chrisatthestudy
 * -----------------------------------------------------------------------------
 * See the end of this file for the main entry point
 */

//function to get random number upto m
function randomRange(minVal, maxVal)
{
  return minVal + Math.floor((Math.random() * (maxVal - minVal)));
}

/*
 * =============================================================================
 * Moon() - handler for the Moon image
 * =============================================================================
 */
//{{{
var Moon = function( options ) {
    
    var self = {
        
        // setup()
        // Initialises the sprite
        setup: function( options ) {
            this.sprite = new jaws.Sprite( {image: "graphics/moon.png", x: 160, y: -6800} );
            this.speed = {
                x: 0,
                y: 0
            };
        },
        
        // update()
        // Updates the sprite, moving it based on the current speed
        update: function( ) {
            if (this.elevation > 6400) {
                this.sprite.x = this.sprite.x - this.speed.x;
            }
            this.sprite.y = this.sprite.y + this.speed.y;
        },
        
        // draw()
        // Draws the sprite on-screen
        draw: function( ) {
            this.sprite.draw();
        },
        
        setSpeed: function ( speed, elevation ) {
            this.speed.x = speed.x;
            this.speed.y = speed.y;
            this.elevation = elevation;
        }
        
    }
 
    self.setup( options );
    return self;
};
//}}}

/*
 * =============================================================================
 * Tree() - simple background object
 * =============================================================================
 */
//{{{
var Tree = function( options ) {
    
    var self = {
        
        // setup()
        // Initialises the sprite
        setup: function( options ) {
            this.sprite = new jaws.Sprite( {image: "graphics/tree.png", x: 160, y: 106} );
            this.speed = {
                x: 0,
                y: 0
            };
        },
        
        // update()
        // Updates the sprite, setting the current frame image
        update: function( ) {
            this.sprite.x = this.sprite.x - this.speed.x;
            this.sprite.y = this.sprite.y + this.speed.y;
        },
        
        // draw()
        // Draws the sprite on-screen
        draw: function( ) {
            this.sprite.draw();
        },
        
        setSpeed: function ( speed, elevation ) {
            this.speed.x = speed.x;
            this.speed.y = speed.y;
        }
        
    }
 
    self.setup( options );
    return self;
};
//}}}

/*
 * =============================================================================
 * Bird() - handler for a single animated bird
 * =============================================================================
 */
//{{{
var Bird = function( options ) {
    
    var self = {
        
        // setup()
        // Initialises the sprite
        setup: function( options ) {
            this.context = options.context;
            this.rightward_anim = new jaws.Animation( {sprite_sheet: "graphics/bird_01a.png", frame_size: [32, 32], frame_duration: 200, loop: true} );
            this.leftward_anim = new jaws.Animation( {sprite_sheet: "graphics/bird_01b.png", frame_size: [32, 32], frame_duration: 200, loop: true} );
            this.sprite = new jaws.Sprite( options );
            // The speed is the speed and direction that the sprite must move
            // at to maintain the illusion that the balloon is moving -- the
            // motion of the sprite is added to this to get the final actual
            // speed.
            this.speed = {
                x: 0,
                y: 0
            };
            this.x = this.sprite.x;
            this.y = this.sprite.y;
            this.radius = 12;
            this.reset( );
        },
        
        // update()
        // Updates the sprite, setting the current frame image
        update: function( ) {
            this.sprite.setImage( this.anim.next() );
            this.sprite.x = this.sprite.x - this.speed.x + this.motion;
            this.sprite.y = this.sprite.y + this.speed.y;
            this.x = this.sprite.x;
            this.y = this.sprite.y;
        },
        
        // draw()
        // Draws the sprite on-screen
        draw: function( ) {
            this.sprite.draw();
            /*
            this.context.fillStyle = "rgba(0, 0, 200, 0.5)";
            this.context.fillRect( this.rect().x, this.rect().y, this.rect().width, this.rect().height );
            */
        },
        
        setSpeed: function ( speed, elevation ) {
            this.speed.x = speed.x;
            this.speed.y = speed.y;
        },
        
        reset: function( ) {
            if (Math.random() > 0.5) {
                this.direction = 1;
                this.sprite.x = -Math.floor(Math.random()*320);
                this.anim = this.rightward_anim;
            } else {
                this.direction = -1;
                this.sprite.x = jaws.width + Math.floor(Math.random()*320);
                this.anim = this.leftward_anim;
            }
            if (Math.random() > 0.5) {
                this.sprite.y = -Math.floor(Math.random()*480);
            } else {
                this.sprite.y = jaws.height + Math.floor(Math.random()*480);
            }
            this.collided = false;
            this.motion = (1.0 + Math.random()) * this.direction;
        },
        
        rect: function( ) {
            return this.sprite.rect();
        }
        
    }
 
    self.setup( options );
    return self;
};
//}}}

/*
 * =============================================================================
 * Flock() - handler for a collection of Bird objects
 * =============================================================================
 */
//{{{
var Flock = function( options ) {
    
    var self = {
        setup: function( options ) {
            this.context = options.context;
            this.birds = new jaws.SpriteList( );
            for (var i = 0; i < 5; i ++) {
                this.birds.push( Bird( {context: this.context} ));
            }
            this.speed = {
                x: 0,
                y: 0
            }
            this.elevation = 0;
        },
        
        update: function( ) {
            for ( var i = 0; i < this.birds.length; i++ ) {
                this.birds.at(i).setSpeed( this.speed );
                this.birds.at(i).update( );
            }
            this.birds.forEach( function( item ) {
                var offscreen_x = (item.rect().x > jaws.width);
                if (item.motion < 0) {
                    offscreen_x = (item.rect().x < -item.rect().width);
                }
                var offscreen_y = (item.rect().y > jaws.height);
                if (offscreen_x || offscreen_y) {
                    item.reset( );
                }
            });
        },
        
        draw: function( ) {
            this.birds.draw( );
        },
        
        setSpeed: function ( speed, elevation ) {
            this.speed.x = speed.x;
            this.speed.y = speed.y;
            this.elevation = elevation;
        },
        
    };
    
    self.setup( options );
    return self;
};
//}}}

/*
 * =============================================================================
 * EnergyPulse() - energy pulse sprite
 * =============================================================================
 */
//{{{
var EnergyPulse = function( options ) {
    
    var self = {
        
        // setup()
        // Initialises the sprite
        setup: function( options ) {
            this.animation = new jaws.Animation( {sprite_sheet: "graphics/energy_pulse.png", frame_size: [32, 32], frame_duration: 200, bounce: true} );
            this.sprite = new jaws.Sprite( options );
            this.speed = {
                x: 0,
                y: 0
            };
            this.elevation = 0;
            this.radius = 12; // this.sprite.rect().width / 2;
            this.reset();
        },
        
        // update()
        // Updates the sprite, setting the current frame image
        update: function( ) {
            this.sprite.setImage( this.animation.next() );
            this.sprite.x = this.sprite.x - this.speed.x;
            this.sprite.y = this.sprite.y + this.speed.y;
            this.x = this.sprite.x;
            this.y = this.sprite.y;
        },
        
        // draw()
        // Draws the sprite on-screen
        draw: function( ) {
            this.sprite.draw();
        },
        
        setSpeed: function ( speed, elevation ) {
            this.speed.x = speed.x;
            this.speed.y = speed.y;
            this.elevation = elevation;
        },
        
        rect: function( ) {
            return this.sprite.rect();
        },
        
        reset: function( ) {
            this.sprite.x = Math.floor(Math.random()*640) - 320;
            if (this.elevation > 480) {
                if (Math.random() > 0.5) {
                    this.sprite.y = -Math.floor(Math.random()*480);
                } else {
                    this.sprite.y = jaws.height + Math.floor(Math.random()*480);
                }
            } else {
                this.sprite.y = Math.floor(Math.random()*240);
            }
            this.x = this.sprite.x;
            this.y = this.sprite.y;
            this.collided = false;
        }
        
    }
 
    self.setup( options );
    return self;
};
//}}}

/*
 * =============================================================================
 * PulseCollection() - Handler for all the existing Energy Pulse objects
 * =============================================================================
 */
//{{{
var PulseCollection = function( options ) {
    
    var self = {
        setup: function( options ) {
            this.pulses = new jaws.SpriteList( );
            for (var i = 0; i < 10; i ++) {
                this.pulses.push( EnergyPulse( { } ));
            }
            this.speed = {
                x: 0,
                y: 0
            }
            this.elevation = 0;
        },
        
        update: function( ) {
            for ( var i = 0; i < this.pulses.length; i++ ) {
                this.pulses.at(i).setSpeed( this.speed, this.elevation );
                this.pulses.at(i).update( );
            }
            this.pulses.forEach( function( item ) {
                if (item.rect().x < -320 || item.rect().x > (jaws.width * 2) || item.rect().y < -480 || item.rect().y > (jaws.height * 2) || item.collided) {
                    item.reset( );
                }
            });
        },
        
        draw: function( ) {
            this.pulses.draw( );
        },
        
        setSpeed: function ( speed, elevation ) {
            this.speed.x = speed.x;
            this.speed.y = speed.y;
            this.elevation = elevation;
        }
        
    };
    
    self.setup( options );
    return self;
};
//}}}

/*
 * =============================================================================
 * Sky() - Handler for the sky and associated components
 * =============================================================================
 * This handles almost everything except the balloon itself.
 */
//{{{
var Sky = function( options ) {
    
    var self = {
        
        setup: function( options ) {
            this.parallax = new jaws.Parallax({repeat_y: true, repeat_x: true});
            this.parallax.addLayer({image: "graphics/stars.png", damping: 1});
            this.parallax.addLayer({image: "graphics/backdrop.png", damping: 1});
            this.ground = new jaws.Parallax({repeat_x: true});
            this.ground.addLayer({image: "graphics/grass.png", damping: 1});
            this.moon = Moon( options );
            this.tree = Tree( options );
            this.pulses = PulseCollection( options );
            this.speed = {
                x: 0,
                y: 0.25
            };
            this.elevation = 0;
            this.flock = Flock( options );
        },
        
        update: function( ) {
            this.parallax.camera_y -= this.speed.y;
            this.parallax.camera_x += this.speed.x;
            this.ground.camera_x += this.speed.x;
            this.ground.camera_y -= this.speed.y;
            this.pulses.update( );
            this.flock.update( );
            this.moon.update( );
            this.tree.update( );
        },
        
        draw: function( ) {
            this.parallax.draw( );
            this.ground.draw( );
            this.tree.draw( );
            this.moon.draw( );
        },
        
        drawForeground: function( ) {
            this.pulses.draw( );
            this.flock.draw( );
        },
        
        setSpeed: function ( speed, elevation ) {
            this.speed.x = speed.x;
            this.speed.y = speed.y;
            this.elevation = elevation;
            this.moon.setSpeed( speed, elevation );
            this.pulses.setSpeed( speed, elevation );
            this.flock.setSpeed( speed, elevation );
            this.tree.setSpeed( speed, elevation );
        },
        
        setOpacity: function( value ) {
            this.parallax.layers[1].alpha = value;
        }
        
    }
    
    self.setup( options );
    return self;
};
//}}} 

/*
 * =============================================================================
 * Player() - Handler for the main player object
 * =============================================================================
 */
//{{{
var Player = function( options ) {
    
    var self = {
        setup: function( options ) {
            this.sprite = new jaws.Sprite( options );
            
            this.context = options.context;
            
            // The elevation property is the height above ground at the bottom
            // of the visible area.
            this.elevation = 0;
            this.max_elevation = 0;
            
            // The amount of energy that the balloon has, between 0 and 1. The
            // more energy it has, the faster it rises. If its energy falls to
            // zero, it begins to descend.
            this.energy = 0;
            
            // The amount of thrust applied to the balloon by the player,
            // and the direction. This is added to the upward thrust provided
            // by the balloon's energy.
            this.thrust = {
                x: 0,
                y: 0
            };

            // The actual speed of the balloon (the sum of the speed from the
            // thrust and the speed from the energy)            
            this.speed = {
                x: 0,
                y: 0
            };
            
            // When the balloon moves left or right it also rotates slightly,
            // for a more realistic effect.
            this.rotation = 0;
            
            // The top-collider and bottom-collider objects (which are set up
            // in the update() method) are used to detect collisions with the
            // top or bottom part of the balloon -- dividing it into these two
            // separate areas allows for better collision-detection.
            this.topCollider = null;
            this.bottomCollider = null;
        },
        
        update: function() {
            //this.sprite.x = this.sprite.x + this.thrust.x;
            //this.sprite.y = this.sprite.y + this.thrust.y;
            if (this.thrust.x > 0) {
                this.thrust.x = this.thrust.x - 0.01;
                if (this.thrust.x < 0.01) {
                    this.thrust.x = 0;
                }
                if (this.rotation < 10) {
                    if (this.rotation < 0) {
                        this.rotation = this.rotation + 0.5;
                    } else {
                        this.rotation = this.rotation + 0.1;
                    }
                } 
                this.sprite.rotateTo(this.rotation);
            } else if (this.thrust.x < 0) {
                this.thrust.x = this.thrust.x + 0.01;
                if (this.thrust.x > -0.01) {
                    this.thrust.x = 0;
                }
                if (this.rotation > -10) {
                    if (this.rotation > 0) {
                        this.rotation = this.rotation - 0.5;
                    } else {
                        this.rotation = this.rotation - 0.1;
                    }
                }
                this.sprite.rotateTo(this.rotation);
            } else {
                if (this.rotation > 0) {
                    this.rotation = this.rotation - 0.2;
                    if (this.rotation < 0.2) {
                        this.rotation = 0;
                    }
                    this.sprite.rotateTo(this.rotation);
                } else if (this.rotation < 0) {
                    this.rotation = this.rotation + 0.2;
                    if (this.rotation > -0.2) {
                        this.rotation = 0;
                    }
                    this.sprite.rotateTo(this.rotation);
                }
            }
            if (this.thrust.y > 0) {
                this.thrust.y = this.thrust.y - 0.01;
            }
            this.speed.y = this.thrust.y + this.energy;
            this.speed.x = this.thrust.x;
            this.elevation = this.elevation + this.speed.y;
            if (this.elevation < 0) {
                this.elevation = 0;
                this.speed.y = 0;
            }
            this.max_elevation = Math.max(this.max_elevation, this.elevation);
            var rect = this.sprite.rect();
            this.topRect = jaws.Rect( rect.x, rect.y, rect.width, (rect.height / 2) - 1);
            this.bottomRect = jaws.Rect( rect.x, (rect.y + (rect.height / 2)) + 1, rect.width, rect.height / 2);
            this.topCollider = {
                x: this.topRect.x,
                y: this.topRect.y,
                width: this.topRect.width,
                height: this.topRect.height,
                radius: 18,
                /*
                rect: function() {
                    if (!this.cached_rect) {
                        this.cached_rect = new jaws.Rect(this.x, this.y, this.width, this.height);
                    }
                    return this.cached_rect;
                }
                */
            }
            this.bottomCollider = {
                x: this.bottomRect.x + 10,
                y: this.bottomRect.y,
                width: 28,
                height: 32,
                rect: function() {
                    if (!this.cached_rect) {
                        this.cached_rect = new jaws.Rect(this.x, this.y, this.width, this.height);
                    }
                    return this.cached_rect;
                }
            }
        },
        
        draw: function() {
            this.sprite.draw();
            /*
            this.context.fillStyle = "rgba(0, 0, 200, 0.5)";
            this.context.fillRect( this.topCollider.x, this.topCollider.y, this.topCollider.width, this.topCollider.height );
            this.context.fillRect( this.bottomCollider.x, this.bottomCollider.y, this.bottomCollider.width, this.bottomCollider.height );
            */
        },
        
        position: function() {
            return {
                x: this.sprite.x,
                y: this.sprite.y
            }
        },
        
        isAt: function( x, y ) {
            return this.sprite.rect().collidePoint( x, y );
        },
        
        hitTop: function( x, y ) {
            return this.topRect.collidePoint( x, y );
        },
        
        hitBottom: function( x, y ) {
            return this.bottomRect.collidePoint( x, y );
        },
        
        rect: function( ) {
            return this.sprite.rect();
        },

        checkCollisions: function( withObjects ) {
            var atLeastOneCollision = false;
            collisions = jaws.collideOneWithMany( this.topCollider, withObjects );
            for (var i = 0; i < collisions.length; i++) {
                if (!collisions[i].collided) {
                    collisions[i].collided = true;
                    atLeastOneCollision = true;
                }
            }
            if (atLeastOneCollision) {
                return true;
            } else {
                collisions = jaws.collideOneWithMany( this.bottomCollider, withObjects );
                for (var i = 0; i < collisions.length; i++) {
                    if (!collisions[i].collided) {
                        collisions[i].collided = true;
                        atLeastOneCollision = true;
                    }
                }
                if (collisions.length > 0) {
                    return true;
                }
            }
            return false;
        }
    };
    
    self.setup( options );
    return self;
};    
//}}}

/*
 * =============================================================================
 * HUD() - tracks and displays the balloon status
 * =============================================================================
 */
//{{{
var HUD = function( options ) {
    
    var self = {
        
        // setup()
        // Initialises the bar
        setup: function( options ) {
            this.context = options.context;
            this.energy = 0.5;
            this.elevation = 0;
            this.width  = 128;
        },
        
        update: function( ) {
            this.dec( 0.001 );
        },

        setShadow: function( on ) {
            if (on) {
                this.context.shadowOffsetX=0;
                this.context.shadowOffsetY=0;
                this.context.shadowColor="#ffffff";
                this.context.shadowBlur = 5;
                this.context.strokeStyle = 'white';
                this.context.lineWidth = 3;
            } else {
                this.context.shadowOffsetX=0;
                this.context.shadowOffsetY=0;
                this.context.shadowColor="#ffffff";
                this.context.shadowBlur = 0;
            }
        },
        
        draw: function( ) {
            var x = 4;
            var y = 16;
            var w = this.energy * 128;
            var h = 8;
            this.context.font = "11pt Georgia";
            this.context.fillStyle = "#000000";
            this.context.textAlign = "left";

            this.setShadow( true );
            this.context.strokeText("Energy: ", x, y);

            this.setShadow( false );
            this.context.fillText("Energy: ", x, y);

            x = 64;
            y = 8;
            this.context.fillStyle = "#66ff66";
            this.context.fillRect(x, y, w, h);
            x = 200;
            y = 16;
            this.context.fillStyle = "#000000";

            this.setShadow( true );
            this.context.strokeText("Height: " + Math.floor(this.elevation), x, y);            

            this.setShadow( false );            
            this.context.fillText("Height: " + Math.floor(this.elevation), x, y);

        },
        
        inc: function( byAmount ) {
            this.energy = this.energy + byAmount;
            if (this.energy > 1.0) {
                this.energy = 1.0;
            }
        },
        
        dec: function( byAmount ) {
            this.energy = this.energy - byAmount;
            if (this.energy < 0.0) {
                this.energy = 0.0;
            }
        }
    }
  
    self.setup( options );
    return self;
};
//}}}

/*
 * =============================================================================
 * Intro() - Intro state handler.
 * =============================================================================
 */
//{{{
var Intro = function() {
    
    var self = {

        // ---------------------------------------------------------------------
        // setup()
        // ---------------------------------------------------------------------
        // Creates and initialises the components. This is called
        // automatically by the jaws library.
        //{{{
        setup: function() {
            // Load the Intro graphic
            this.background = new jaws.Sprite({image: "graphics/intro.png"});
            this.buttonRect = new jaws.Rect(206, 435, 74, 26)
            
            // Direct any mouse-clicks to our onClick event-handler
            jaws.on_keydown(["left_mouse_button", "right_mouse_button"], function(key) { self.onClick(key); });
        },
        //}}}
        
        // ---------------------------------------------------------------------
        // update()
        // ---------------------------------------------------------------------
        // Updates the game components. This is called automatically by the
        // jaws library.
        //{{{        
        update: function() {
            // this.intro.update();
        },
        //}}}
        
        // ---------------------------------------------------------------------
        // draw()
        // ---------------------------------------------------------------------
        // Draws the game components. This is called automatically by the jaws
        // library.
        //{{{
        draw: function() {
            this.background.draw();
        },
        //}}}

        // ---------------------------------------------------------------------
        // onClick()
        // ---------------------------------------------------------------------
        // This callback is called by the jaws library when the mouse is 
        // clicked. See the jaws.on_keydown() call in the setup() method.
        //{{{        
        onClick: function(key) {
            var x = jaws.mouse_x;
            var y = jaws.mouse_y - 16;
            var rune;
            if (key === "left_mouse_button") {
                if (this.buttonRect.collidePoint(x, y)) {
                    jaws.switchGameState( Game );
                }                    
            }
        }
        //}}}
    };
    
    return self;
};
//}}}

/*
 * =============================================================================
 * Game() - Main game state handler.
 * =============================================================================
 */
//{{{ 
var Game = function() { 
    
    var self = {

        // ---------------------------------------------------------------------
        // Variables
        // ---------------------------------------------------------------------
        //{{{
        
        // Game components. These are actually created and initialised when the
        // init() method is called.
        board: null,
        //}}}
        
        // ---------------------------------------------------------------------
        // Methods
        // ---------------------------------------------------------------------
        //{{{
        
        // ---------------------------------------------------------------------
        // setup()
        // ---------------------------------------------------------------------
        // Creates and initialises the game components. This is called
        // automatically by the jaws library.
        //{{{
        setup: function() {
            
            // The jaws library will locate the canvas element itself, but it
            // it is useful to have our reference to it, for drawing directly
            // on to the canvas.
            this.canvas  = document.getElementById("board");
            this.context = this.canvas.getContext("2d");
            
            // Set up a default font for text output on the canvas
            this.context.font      = "12px Georgia";
            this.context.fillStyle = "#ffeecc";
            
            // Load the backdrop for the game
            this.sky = Sky({context: this.context});
            
            // Create the player object
            this.player = Player({image: "graphics/player.png", x: 136, y: 168, anchor_x: 0.5, anchor_y: 0.1, context: this.context});
            
            // Create the energy display bar
            this.hud = HUD( {context: this.context} );
            
            // Load and play the game soundtrack
            this.gameTrack = new Audio("sounds/DST-3rdBallad.ogg");
            this.gameTrack.volume = 0.5;
            this.gameTrack.addEventListener("ended", function() {
                this.currentTime = 0;
                this.play();
            }, false);
            this.gameTrack.play();

            this.fader = new jaws.Sprite({image: "graphics/fader.png"});
            this.fader.alpha = 0;
            
            this.birdCollisionCounter = 0;
            this.pulseCollisionCounter = 0;
            
            this.gameover = false;
            this.timeout = 0;
            
            this.buttonRect = new jaws.Rect(80, 400, 160, 56);
            
            // Direct any mouse-clicks to our onClick event-handler
            jaws.on_keydown(["left_mouse_button", "right_mouse_button"], function(key) { self.onClick(key); });
        },
        //}}}

        // ---------------------------------------------------------------------
        // update()
        // ---------------------------------------------------------------------
        // Updates the game components. This is called automatically by the
        // jaws library.
        //{{{        
        update: function() {
            if (this.gameover) {
                this.fader.alpha = this.fader.alpha + 0.01;
                if (this.fader.alpha > 1.0) {
                    this.fader.alpha = 1.0;
                }
            }
            this.player.energy = this.hud.energy;
            if (this.hud.energy === 0) {
                this.timeout = this.timeout + 1;
                this.player.energy = this.player.energy - 1;
            } else {
                this.timeout = 0;
            }
            if (this.timeout > 480) {
                this.gameover = true;
            }
            this.player.update();
            if ((this.player.elevation > 2000) && (this.player.elevation < 7000)) {
                this.sky.setOpacity( 1 - ((this.player.elevation - 2000) / 5000) );
            }
            this.hud.elevation = this.player.elevation;
            this.sky.setSpeed(this.player.speed, this.player.elevation);
            this.sky.update( );
            if (this.player.checkCollisions(this.sky.pulses.pulses)) {
                this.hud.inc(0.5);
                this.pulseCollisionCounter = 5;
            }
            if (this.player.checkCollisions(this.sky.flock.birds)) {
                this.hud.dec(0.1);
                this.birdCollisionCounter = 5;
            }
            this.hud.update();
        },
        //}}}
        
        // ---------------------------------------------------------------------
        // draw()
        // ---------------------------------------------------------------------
        // Draws the game components. This is called automatically by the jaws
        // library.
        //{{{
        draw: function() {
            this.sky.draw();
            if (this.birdCollisionCounter > 0) {
                this.setBirdCollisionAura(true, 1 - (this.birdCollisionCounter / 10));
                this.birdCollisionCounter = this.birdCollisionCounter - 1;
            }
            if (this.pulseCollisionCounter > 0) {
                this.setPulseCollisionAura(true, 1 - (this.pulseCollisionCounter / 10));
                this.pulseCollisionCounter = this.pulseCollisionCounter - 1;
            }
            this.player.draw();
            this.setBirdCollisionAura(false);
            this.setPulseCollisionAura(false);
            this.sky.drawForeground();
            this.hud.draw();
            this.fader.draw( );
            if (this.gameover) {
                this.context.font = "bold 11pt Georgia";
                this.context.fillStyle = "#000000";
                this.context.textAlign = "center";
    
                x = 160;
                y = 120;
                this.context.fillText("Your maximum height:", x, y);
                y = y + 32;
                this.context.fillText(Math.floor(this.player.max_elevation), x, y);
            }
        },
        //}}}
        
        // ---------------------------------------------------------------------
        // onClick()
        // ---------------------------------------------------------------------
        // This callback is called by the jaws library when the mouse is 
        // clicked. See the jaws.on_keydown() call in the setup() method.
        //{{{        
        onClick: function(key) {
            var x = jaws.mouse_x;
            var y = jaws.mouse_y - 16; // The canvas top is offset by 16
            var rune;
            if (key === "left_mouse_button") {
                if (!this.gameover) {
                    var pos = this.player.position();
                    if (this.player.hitTop(x, y)) {
                        if (this.player.thrust.y <= 0) {
                            if (this.player.energy > 0) {
                                this.player.thrust.y = this.player.thrust.y + 1;
                            } else {
                                this.player.thrust.y = this.player.thrust.y + 1 + this.player.energy;
                            }
                        }
                    } else if (this.player.hitBottom(x, y)) {
                        this.player.thrust.y = this.player.thrust.y - 1;
                    } else if (x > pos.x) {
                        this.player.thrust.x = 1;
                    } else {
                        this.player.thrust.x = -1;
                    }
                } else {
                    if (this.buttonRect.collidePoint(x, y)) {
                        window.location.reload();
                    }
                }
            }
        },
        //}}}
        
        setBirdCollisionAura: function( on, amount ) {
            if (on) {
                this.context.shadowOffsetX=0;
                this.context.shadowOffsetY=0;
                this.context.shadowColor="rgba(255, 0, 0, " + amount + ")";
                this.context.shadowBlur = 5;
            } else {
                this.context.shadowOffsetX=0;
                this.context.shadowOffsetY=0;
                this.context.shadowColor="#ffffff";
                this.context.shadowBlur = 0;
            }
        },
        
        setPulseCollisionAura: function( on, amount ) {
            if (on) {
                this.context.shadowOffsetX=0;
                this.context.shadowOffsetY=0;
                this.context.shadowColor="rgba(0, 255, 0, " + amount + ")";
                this.context.shadowBlur = 5;
            } else {
                this.context.shadowOffsetX=0;
                this.context.shadowOffsetY=0;
                this.context.shadowColor="#ffffff";
                this.context.shadowBlur = 0;
            }
        },
        
        //}}}
    };
    
    return self;
    
};
//}}}

/*
 * =============================================================================
 * Main entry point
 * =============================================================================
 * Loads the game assets and launches the game.
 */
//{{{ 
jaws.onload = function( ) {
    // Pre-load the game assets
    jaws.assets.add( [
            "graphics/intro.png",
            "graphics/backdrop.png",
            "graphics/stars.png",
            "graphics/player.png",
            "graphics/energy_pulse.png",
            "graphics/bird_01a.png",
            "graphics/bird_01b.png",
            "graphics/moon.png",
            "graphics/grass.png",
            "graphics/fader.png"
    ] ); 
    // Start the game running. jaws.start() will handle the game loop for us.
    jaws.start( Intro, {fps: 60} ); 
}
//}}}


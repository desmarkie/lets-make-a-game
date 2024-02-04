
var Bodies = Matter.Bodies, Body = Matter.Body, Composite = Matter.Composite, Vector = Matter.Vector;
class Player {

    constructor()
    {

        // player body
        this.CreatePlayerBody();

        // gameplay vars
        this.maxVelocity = 10;
        this.canJump = true;
        this.mass = 0.75;
        this.friction = Number.MIN_VALUE;
        this.jumpForce = 0.07;
        this.walkSpeed = 0.0335;
        this.fallForce = 0.0025;
        this.isJumping = false;
        this.touchingLeft = false;
        this.touchingRight = false;

        // keyboard control input
        this.keys = {
            up: false,
            down: false,
            left: false,
            right: false
        };

        //add keyboard events
        window.addEventListener("keydown", this.HandleKeyDown.bind( this ));
        window.addEventListener("keyup", this.HandleKeyUp.bind( this ));

    }

    Update = function()
    {
        
        // apply any keyboard input to body force
        var force = this.CheckInput();

        // fall speed adjustment
        if( this.body.velocity.y > 0.1 )
        {
            force.y += this.fallForce;
        }
        else if( this.body.velocity.y < -0.1 )
        {
            force.y += this.fallForce * 0.3;
        }

        // Apply the force
        Body.applyForce( this.body, this.body.position, force );

        //cap velocities
        var updateVelocity = false;
        var newVelocity = this.body.velocity;

        // cap body X speed to limits
        var velocity = this.body.velocity.x;
        if( velocity > this.maxVelocity || velocity < -this.maxVelocity )
        {
            newVelocity.x = velocity > 0 ? this.maxVelocity : -this.maxVelocity;
            updateVelocity = true;
        }

        velocity = this.body.velocity.y;
        if( velocity > 20 )
        {
            newVelocity.y = 20;
            updateVelocity = true;
        }

        if( updateVelocity )
        {
            Body.setVelocity( this.body, newVelocity );
        }




        // console.log(this.body.velocity);

        // // cap body speed to limits
        // var velocity = Vector.magnitude( this.body.velocity );
        // if( velocity > this.maxVelocity )
        // {
        //     var newVelocity = Vector.normalise( this.body.velocity );
        //     newVelocity = Vector.mult( newVelocity, this.maxVelocity );
        //     Body.setVelocity( this.body, newVelocity );
        // }

    }

    ResetTouching = function()
    {
        //reset touching
        this.touchingLeft = false;
        this.touchingRight = false;

        this.left.render.fillStyle = "#33aa33";
        this.right.render.fillStyle = "#33aa33";
    }

    Landed = function( separation )
    {
        this.canJump = true;
        this.isJumping = false;

        this.bottom.render.fillStyle = "#aa3333";

        // var pos = player.body.position;
        // pos.y += separation + 2;
        // Body.setPosition( player.body, pos );
        // var vel = this.body.velocity;
        // vel.y = 0;
        // Body.setVelocity( this.body, vel );
    }

    Fell = function()
    {
        this.canJump = false;
        this.isJumping = true;
        this.bottom.render.fillStyle = "#33aa33";
        // console.log("fell");
    }

    TouchedLeft = function( separation )
    {
        
        this.touchingLeft = true;

        var pos = player.body.position;
        pos.x += separation * 0.025;
        Body.setPosition( player.body, pos, false );
        
        this.left.render.fillStyle = "#aa3333";

        // console.log("touched left", separation);

    }

    TouchedRight = function( separation )
    {
        
        this.touchingRight = true;

        var pos = this.body.position;
        pos.x -= separation * 0.025;
        Body.setPosition( player.body, pos, false );
        
        this.right.render.fillStyle = "#aa3333";

        // console.log("touched right", separation);

    }

    CreatePlayerBody = function()
    {
        
        this.mainBody = Bodies.rectangle(0, 0, 30, 30, { label: "p_body", render: { fillStyle: "#cccccc" } } );
        Body.setInertia( this.mainBody, Infinity );

        this.left = Bodies.rectangle( -19, -2, 8, 25, { isSensor: true, label: "p_left", render: { fillStyle: "#33aa33", visible: false } } );
        this.right = Bodies.rectangle( 19, -2, 8, 25, { isSensor: true, label: "p_right", render: { fillStyle: "#33aa33", visible: false } } );
        this.bottom = Bodies.rectangle( 0, 19, 20, 8, { isSensor: true, label: "p_bottom", render: { fillStyle: "#33aa33", visible: false } } );

        this.body = Body.create({
            parts: [ this.mainBody, this.left, this.right, this.bottom ],
            friction: this.friction,
            frictionStatic: Number.MIN_VALUE,
            frictionAir: Number.MIN_VALUE,
            mass: this.mass
        });
        Body.setPosition( this.body, { x:400, y:300 } );

    }

    CheckInput = function()
    {

        // create an x force for moving, driven by input
        var x = 0;
        if( this.keys.left && !this.touchingLeft )
        {
            x -= this.walkSpeed;
        }
        
        if( this.keys.right && !this.touchingRight )
        {
            x += this.walkSpeed;
        }
        
        if( this.isJumping )
        {
            x *= 0.055;
        }

        // create a y force for jumping, driven by input
        var y = 0;
        if( this.keys.up && this.canJump ) 
        {
            y = -this.jumpForce;
            this.canJump = false;
            this.keys.up = false;
            this.isJumping = true;
        }

        // return force vector
        return { x: x, y: y };

    }

    // Keyboard input handlers
    HandleKeyDown = function( event )
    {
        if( event.key == "ArrowLeft"    || event.key == "a" ) this.keys.left    = true;
        if( event.key == "ArrowRight"   || event.key == "d" ) this.keys.right   = true;
        if( event.key == "ArrowUp"      || event.key == "w" ) this.keys.up      = true;
        if( event.key == "ArrowDown"    || event.key == "s" ) this.keys.down    = true;
    }

    HandleKeyUp = function( event )
    {
        if( event.key == "ArrowLeft"    || event.key == "a" ) this.keys.left    = false;
        if( event.key == "ArrowRight"   || event.key == "d" ) this.keys.right   = false;
        if( event.key == "ArrowUp"      || event.key == "w" ) this.keys.up      = false;
        if( event.key == "ArrowDown"    || event.key == "s" ) this.keys.down    = false;
    }
}

export { Player };

import { Player } from "./player.js";

// module aliases
var Engine = Matter.Engine,
Render = Matter.Render,
Runner = Matter.Runner,
Bodies = Matter.Bodies,
Body = Matter.Body,
Composite = Matter.Composite,
Events = Matter.Events;

var player;
var engine;
var render;
var runner;
var objects = [];

function InitMatterJS()
{

    // create an engine
    engine = Engine.create();

    // create a renderer
    render = Render.create({
        element: document.body,
        engine: engine,
        options: {
            wireframes: false
        }
    });

    // create two boxes and a ground
    var boxA = Bodies.rectangle( 200, 480, 240, 30, { isStatic: true, label: "ground", chamfer: 10 } );
    var boxB = Bodies.rectangle( 600, 480, 240, 30, { isStatic: true, label: "ground", chamfer: 10 } );
    var boxC = Bodies.rectangle( 600, 350, 120, 30, { isStatic: true, label: "ground", chamfer: 10 } );
    var boxD = Bodies.rectangle( 200, 250, 120, 30, { isStatic: true, label: "ground", chamfer: 10 } );
    var ground = Bodies.rectangle( 400, 610, 810, 60, { isStatic: true, label: "ground", chamfer: 10 } );
    var wallLeft = Bodies.rectangle( 810, 300, 60, 610, { isStatic: true, label: "ground", chamfer: 10 } );
    var wallRight = Bodies.rectangle( -10, 300, 60, 610, { isStatic: true, label: "ground", chamfer: 10 } );

    objects.push( boxA, boxB, boxC, boxD, ground, wallLeft, wallRight );
    //objects.push( ground );

}

function AddObjectsToWorld()
{

    objects.push( player.body );

    // add all of the bodies to the world
    Composite.add(engine.world, objects);

}

function StartEngine()
{

    // run the renderer
    Render.run(render);

    // create runner
    runner = Runner.create();
    Events.on(runner, "afterUpdate", AfterUpdate.bind( this ) );
    Events.on(runner, "beforeUpdate", BeforeUpdate.bind( this ) );

    // collision handling
    Events.on( engine, "collisionStart", HandleCollisionStart.bind( this ) );
    Events.on( engine, "collisionActive", HandleCollisionActive.bind( this ) );
    Events.on( engine, "collisionEnd", HandleCollisionEnd.bind( this ) );

    // run the engine
    Runner.run(runner, engine);

}

// this is a whole thing....
function HandleCollisionStart( event )
{

    // event.pairs.forEach( pair => {

    //     if( pair.bodyA.label == "p_bottom" || pair.bodyB.label == "p_bottom" )
    //     {
    //         player.bottom.render.fillStyle = "#aa3333";
    //     }

    // });

}

// this is a whole thing....
function HandleCollisionActive( event )
{
    //console.log( event );

    // check for grounding
    event.pairs.filter( pair => {
      
        var condition1 = pair.bodyA.label === "ground" && pair.bodyB.label === "p_bottom";
        var condition2 = pair.bodyA.label === "p_bottom" && pair.bodyB.label === "ground";

        return condition1 || condition2;

    }).forEach(pair => {
      
        player.Landed( pair.separation );
        player.bottom.render.fillStyle = "#aa3333";

    });

    // check for wall hits
    event.pairs.filter( pair => {
      
        var condition1 = pair.bodyA.label === "ground" && pair.bodyB.label === "p_left";
        var condition2 = pair.bodyA.label === "p_left" && pair.bodyB.label === "ground";
        var condition3 = pair.bodyA.label === "ground" && pair.bodyB.label === "p_right";
        var condition4 = pair.bodyA.label === "p_right" && pair.bodyB.label === "ground";

        return condition1 || condition2 || condition3 || condition4;

    }).forEach(pair => {
      
        if( pair.bodyA.label == "p_right" || pair.bodyB.label == "p_right" )
        {
            if( pair.separation > 0.5 )
            {
                player.TouchedRight( pair.separation );
            }
            // console.log("right", pair);
        }

        // touching left
        if( pair.bodyA.label == "p_left" || pair.bodyB.label == "p_left" )
        {
            if( pair.separation > 0.5 )
            {
                player.TouchedLeft( pair.separation );
            }
            // console.log("left", pair);
        }

    });

}

function HandleCollisionEnd( event )
{

    // check for walk off platform
    event.pairs.filter( pair => {
      
        var condition1 = pair.bodyA.label === "ground" && pair.bodyB.label === "p_bottom";
        var condition2 = pair.bodyA.label === "p_bottom" && pair.bodyB.label === "ground";

        return condition1 || condition2;

    }).forEach(pair => {
      
        player.Fell();

    });

}

function InitPlayer()
{

    player = new Player();
    window.player = player;

}

function AfterUpdate()
{
    player.Update();
}

function BeforeUpdate()
{
    player.ResetTouching();
}

document.addEventListener("DOMContentLoaded", function()
{
    
    InitMatterJS();
    
    InitPlayer();

    AddObjectsToWorld();

    StartEngine();

});
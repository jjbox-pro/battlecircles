class Game{
    constructor(appl, scene){
        this.appl = appl;
        this.scene = scene;
    }

    init(){
        this.resList = {
            enemy: {
                type: 'img',
                img: new Image(),
                src: _url_.img('/enemy.png'),
                sWidth: 42,
                sHeight: 42,
                loaded: false
            },
            gun: {
                type: 'img',
                img: new Image(),
                src: _url_.img('/gun.png'),
                sWidth: 206,
                sHeight: 96,
                loaded: false
            },
            magazine: {
                type: 'img',
                img: new Image(),
                src: _url_.img('/magazine.png'),
                sWidth: 44,
                sHeight: 40,
                loaded: false
            },
            view: {
                type: 'img',
                img: new Image(),
                src: _url_.img('/view.png'),
                sWidth: 1000,
                sHeight: 1000,
                loaded: false
            },
            shot: (()=>{
                const resource = {
                    type: 'snd',
                    src: _url_.snd('/shot.mp3'),
                    loaded: false
                };

                resource.create = (...args) => {
                    const audio = new Audio(args);
                    
                    audio.volume = 0.3;

                    return audio;
                }

                resource.snd = resource.create();

                return resource;
            })(),
            reload: {
                type: 'snd',
                snd: new Audio(),
                src: _url_.snd('/reload.mp3'),
                loaded: false
            },
            noammo: {
                type: 'snd',
                snd: new Audio(),
                src: _url_.snd('/noammo.mp3'),
                loaded: false
            },
            catchup: {
                type: 'snd',
                snd: new Audio(),
                src: _url_.snd('/catchup.mp3'),
                loaded: false
            },
            moving: {
                type: 'snd',
                snd: (() => {
                    const audio = new Audio();

                    audio.loop = true;
                    audio.volume = 0.3;

                    return audio;
                })(),
                src: _url_.snd('/moving.mp3'),
                loaded: false
            },
        };
        
        for(var res in this.resList ){
            res = this.resList[res];
            
            var resCls = res[res.type];
            
            resCls.res = res;
            resCls.onload = function(){
                this.res.loaded = true;
            };
            resCls.src = res.src; 
        }
        
        this.gameObjectsList = {};
        
        this.gameObjectMgr = new GameObjectMgr(this);
        
        this.initGameObjectsList();
        
        return this;
    }
    
    
    
    process(){
        let gameObject;
        for(gameObject in this.gameObjectsList)
            this.gameObjectsList[gameObject].process(this.scene);
    }
    
    render(){
        this.scene.clean();
        
        this.scene.getContext().save();
        
        this.camera.pos = this.scene.center.getDiffVector(this.person.pos);
        
        this.scene.getContext().translate(this.camera.pos.x, this.camera.pos.y);
        
        for(var gameObject in this.gameObjectsList){
            gameObject = this.gameObjectsList[gameObject];
            
            if( gameObject.inView(this.scene) )
                gameObject.draw(this.scene);
        }
        
        this.scene.getContext().restore();
    }
    
    free(){
        let gameObject;
        for(gameObject in this.gameObjectsList)
            this.gameObjectsList[gameObject].free();
    }
    
    
    
    initGameObjectsList(){
        const personCollisions = [];
        
        this.camera = new GameObject();
        
        this.addGameObject(Background);

        for(let i = 0; i < 10; i++){
            this.addGameObject(Enemy, {pos: new Vector2D(100 + utils.random(400), 100 + utils.random(400))});
        }

        personCollisions.push(this.addGameObject(Weapon, {pos: new Vector2D(20, 40)}));
        personCollisions.push(this.addGameObject(Weapon, {pos: new Vector2D(20, 340)}));
        
        this.person = this.addGameObject(Person);
        this.person.setListCollisions(personCollisions);
        
        for(let i = 0; i < 5; i++){
            this.addGameObject(Magazine, {
                pos: new Vector2D(150 + utils.random(500), 150 + utils.random(500)),
                listCollisions: [this.person]
            });
        }

        this.aim = this.addGameObject(Aim);
        
        this.addGameObject(GoView);

        
    }
    
    addGameObject(gameObject, opt){
        gameObject = this.gameObjectMgr.create(gameObject, opt);
        
        return this.gameObjectsList[gameObject.getHandle()] = gameObject;
    }
    
    delGameObject(gameObject){
        delete this.gameObjectsList[gameObject.getHandle()];
    }
    
    getObjectListByCls(Class){
        const list = [];
        let gameObject;
        
        for(gameObject in this.gameObjectsList){
            gameObject = this.gameObjectsList[gameObject];
            
            if( gameObject instanceof Class )
                list.push(gameObject);
        }
        
        return list;
    }
}



module.exports = {Game}



//#region offlineImports
const { utils } = require('@/app/core/utils');

const { Vector2D } = require('@/app/modules/math/vector2D');

const { GameObject, GameObjectMgr, GoView, Background } = require('@/app/modules/game/objects/object');
const { Enemy } = require('@/app/modules/game/objects/object.entity');
const { Weapon, Magazine } = require('@/app/modules/game/objects/object.weapon');
const { Aim } = require('@/app/modules/game/objects/object.aim');
const { Person } = require('@/app/modules/game/objects/object.entity.person');
//#endregion offlineImports
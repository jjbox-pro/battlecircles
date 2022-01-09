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
            view: {
                type: 'img',
                img: new Image(),
                src: _url_.img('/view.png'),
                sWidth: 1000,
                sHeight: 1000,
                loaded: false
            },
            background: {
                type: 'img',
                img: new Image(),
                src: _url_.img('/background.png'),
                sWidth: 248,
                sHeight: 248,
                loaded: false
            },
            shot: {
                type: 'snd',
                snd: new Audio(),
                src: _url_.snd('/shot.mp3'),
                loaded: false
            },
            reload: {
                type: 'snd',
                snd: new Audio(),
                src: _url_.snd('/reload.mp3'),
                loaded: false
            }
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
        var weapons = [];
        
        this.camera = new GameObject();
        
        this.addGameObject(Background);

        for(var i = 0; i < 10; i++){
            this.addGameObject(Enemy, {pos: new Vector2D(100 + utils.random(400), 100 + utils.random(400))});
        }
        
        weapons.push(this.addGameObject(Weapon, {pos: new Vector2D(20, 40)}));
        weapons.push(this.addGameObject(Weapon, {pos: new Vector2D(20, 340)}));
        weapons.push(this.addGameObject(Weapon, {pos: new Vector2D(350, 80)}));
        
        this.person = this.addGameObject(Person);
        this.person.setListCollisions(weapons);
        
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
const { Weapon } = require('@/app/modules/game/objects/object.weapon');
const { Aim } = require('@/app/modules/game/objects/object.aim');
const { Person } = require('@/app/modules/game/objects/object.entity.person');
//#endregion offlineImports
// const PIXI = require('./l2d/pixi.min.js')
// const LIVE2DCUBISMFRAMEWORK = require('./live2dcubismframework.js')

// import PIXI from 
class L2D {
    constructor (basePath) {
        this.basePath = basePath;
        this.loader = new PIXI.loaders.Loader(this.basePath);
        this.animatorBuilder = new LIVE2DCUBISMFRAMEWORK.AnimatorBuilder();
        this.timeScale = 1;
        this.models = {};
        //建立一个触发事件（触摸，加载等）和动作的对应表
        this.TriggerMotions = new Map();
        //建立一个触发区域和对应动作的对应表
        this.TapAreas = new Map();

    }
    
    setPhysics3Json (value) {
        if (!this.physicsRigBuilder) {
            this.physicsRigBuilder = new LIVE2DCUBISMFRAMEWORK.PhysicsRigBuilder();
        }
        this.physicsRigBuilder.setPhysics3Json(value);

        return this;
    }
    
    load (name, v) {
        console.log("loading:", name)
        if (!this.models[name]) {
            let modelDir = name+'/';
            let modelPath = name+'.model3.json';
            let textures = new Array();
            let textureCount = 0;
            let motionNames = new Array();
            let modelNames = new Array();
            let _=this;

            //if (!modelNames.includes(name+'_model')){
                this.loader.add(name+'_model', modelDir+modelPath, { xhrType: PIXI.loaders.Resource.XHR_RESPONSE_TYPE.JSON });
                modelNames.push(name+'_model');
            //}

            this.loader.load((loader, resources) => {
                let model3Obj = resources[name+'_model'].data;
                if (typeof(model3Obj['FileReferences']['Moc']) !== "undefined") {
                    loader.add(name+'_moc', modelDir+model3Obj['FileReferences']['Moc'], { xhrType: PIXI.loaders.Resource.XHR_RESPONSE_TYPE.BUFFER });
                }

                if (typeof(model3Obj['FileReferences']['Textures']) !== "undefined") {
                    model3Obj['FileReferences']['Textures'].forEach((element) => {
                        loader.add(name+'_texture'+textureCount, modelDir+element);
                        textureCount++;
                    });
                }

                if (typeof(model3Obj['FileReferences']['Physics']) !== "undefined") {
                    loader.add(name+'_physics', modelDir+model3Obj['FileReferences']['Physics'], { xhrType: PIXI.loaders.Resource.XHR_RESPONSE_TYPE.JSON });
                }
                if (typeof(model3Obj['FileReferences']['Motions']) !== "undefined") {
                    for (let group in model3Obj['FileReferences']['Motions']) {
                        var groupmotionNames = [];
                        model3Obj['FileReferences']['Motions'][group].forEach((element) => {
                            
                            let motionName = element['File'].split('/').pop().split('.').shift();
                            if (!motionNames.includes(motionName)){
                                loader.add(motionName, modelDir+element['File'], { xhrType: PIXI.loaders.Resource.XHR_RESPONSE_TYPE.JSON });
                                motionNames.push(motionName);
                            } else {
                                var n = motionName+String(Date.now());
                                loader.add(n, modelDir+element['File'], { xhrType: PIXI.loaders.Resource.XHR_RESPONSE_TYPE.JSON });
                                motionNames.push(motionName);
                            }
                            groupmotionNames.push(motionName)
                        });
                        _.TriggerMotions.set(group,groupmotionNames)
                        
                    }
                }

                let groups = null;
                // 原始代码好像不太对劲。。typeof的括号位置不对
                // if (typeof(model3Obj['Groups'] !== "undefined")) {
                //     groups = LIVE2DCUBISMFRAMEWORK.Groups.fromModel3Json(model3Obj);
                // }
                if (typeof(model3Obj['Groups']) !== 'undefined') {
                    groups = LIVE2DCUBISMFRAMEWORK.Groups.fromModel3Json(model3Obj);
                }
                //从HitAreas配置中拿到点击区域和动作的对应关系，输入格式为
                /*
                // "HitAreas": [
                //     {
                //       "Id": "TouchBody",
                //       "Motion": "TapBody"
                //     },
                //    {
                //       "Id": "TouchHead",
                //       "Motion": "TapHead:touch_head,main"
                //     }
                // ]
                */
                if (typeof(model3Obj['HitAreas']) !== 'undefined'){
                    let tempHitAreas = model3Obj['HitAreas'];
                    //按Order排序，Order值越大，越靠前，没有Order的设置为默认值0
                    tempHitAreas.forEach((e)=>{if(!e.Order){e.Order = 0}})
                    tempHitAreas.sort(function(a, b){return b.Order - a.Order}); 
                    console.log(tempHitAreas);
                    tempHitAreas.forEach((e)=>{
                        let [MotionsGroup,MotionsItems] = e.Motion.split(':')
                        if(MotionsItems){
                            _.TapAreas.set(e.Id,MotionsItems.split(','))
                        }else{
                            _.TapAreas.set(e.Id,_.TriggerMotions.get(MotionsGroup))
                        }
                    })
                }
                loader.load((l, r) => {
                    let moc = null;
                    if (typeof(r[name+'_moc']) !== "undefined") {
                        moc = Live2DCubismCore.Moc.fromArrayBuffer(r[name+'_moc'].data);
                    }

                    if (typeof(r[name+'_texture'+0]) !== "undefined") {
                        for (let i = 0; i < textureCount; i++) {
                            textures.splice(i, 0, r[name+'_texture'+i].texture);
                        }
                    }

                    if (typeof(r[name+'_physics']) !== "undefined") {
                        this.setPhysics3Json(r[name+'_physics'].data);
                    }
                    //这里只是把加载了动作数据和动作名，没有把动作和触发事件联系起来
                    let motions = new Map();
                    motionNames.forEach((e) => {
                        motions.set(e, LIVE2DCUBISMFRAMEWORK.Animation.fromMotion3Json(r[e].data));
                    });
    
                    let model = null;

                    let coreModel = Live2DCubismCore.Model.fromMoc(moc);

                    if (coreModel == null) {
                        return;
                    }

                    let animator = this.animatorBuilder
                        .setTarget(coreModel)
                        .setTimeScale(this.timeScale)
                        .build();
                    let physicsRig = this.physicsRigBuilder
                        .setTarget(coreModel)
                        .setTimeScale(this.timeScale)
                        .build();

                    let userData = null;

                    model = LIVE2DCUBISMPIXI.Model._create(coreModel, textures, animator, physicsRig, userData, groups);
                    model.motions = motions;
                    this.models[name] = model;

                    v.changeCanvas(model);
                });
            });
        } else {
            v.changeCanvas(this.models[name]);
        }
    }
}
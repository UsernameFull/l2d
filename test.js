var TriggerMotions=new Map()
TriggerMotions.set("key1","val1")
TriggerMotions.set("key2","val2")
TriggerMotions.set("key3","val3")
TriggerMotions.set("key4","val4")
TriggerMotions.set("key5","val5")
// console.log(TriggerMotions)
let templatestr="if (this.isClick){\n    "
let i=0;
for(let item of TriggerMotions){
    console.log(item)
    // console.log(TriggerMotions.length-1)
    templatestr=templatestr+(i==0?"if":(i==TriggerMotions.size-1?"else":"else if"))
    if (item[0].match("key")){
        templatestr=templatestr+
    `(this.isHit("`+item[0]+`", event.offsetX, event.offsetY)) {
        this.startAnimation("`+item[0]+`", "base")
    }`
    }
    i++
}
console.log(templatestr)
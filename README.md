# imgpreload
图片预加载
## Installation
```
npm install imgpreload --save
```
## Example
```
const imgs = [{
  name:"myimage",
  url:"https://ss0.bdstatic.com/5aV1bjqh_Q23odCf/static/superman/img/logo/bd_logo1_31bdc765.png"
},{
  name:"myimage1",
  url:"https://ss0.bdstatic.com/5aV1bjqh_Q23odCf/static/superman/img/logo/bd_logo1_31bdc765.png?123"
}]

const loads = new Imgpreload()

loads
  .add(imgs)
  .start()
  .ready((width,height)=>{
    console.log(width,height)
  })
  .end((imgs,loadtime)=>{
    console.log('data:',imgs)
    console.log('time:',loadtime)
  })
```
## Methods
```
//todo
```

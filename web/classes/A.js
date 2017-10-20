'use strict'
import { traits } from 'traits-decorator';

class A {
    print(arg) {
        console.log(arg);
    }
}

class B{
    static hello() {
        console.log("hello world");
    }
}

function mix(...mixins) {
  class Mix {}

  for (let mixin of mixins) {
    copyProperties(Mix, mixin);
    copyProperties(Mix.prototype, mixin.prototype);
  }

  return Mix;
}

function copyProperties(target, source) {
  for (let key of Reflect.ownKeys(source)) {
    if ( key !== "constructor"&& key !== "prototype"&& key !== "name") {
        let desc = Object.getOwnPropertyDescriptor(source, key);
        Object.defineProperty(target, key, desc);
    }
  }
}

class C extends mix(A,B) {
  hello() {
    console.log('foo from C');
    super.hello();
  }
}

//@traits(A, B)
//这个必须使用webpack .babelrc transform-decorators-legacy
class MyClass extends mix(A,B){

}

//导出必须知道这个是名称
export {B,MyClass};
//default 无所谓外面用什么名称接收
export default A;
export default C;
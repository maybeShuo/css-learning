function Parent(age) {
    this.age = age;
    this.sayAge = function(){
        console.log(this.age);
    }
}
Parent.prototype.sayParent = function() {alert("this is parentmethod!!!");}

function Child (age) {
    Parent.call(this, age);
}

Child.prototype = new Parent();

var c = new Child("1");
c.sayAge();

var $container = $('.container');
console.log($container);

/* INHERITANCE */
GLOBAL.Person = function(arg_name){
	this.name= arg_name;
}

GLOBAL.Person.prototype.get_name = function(){
	return this.name;
}
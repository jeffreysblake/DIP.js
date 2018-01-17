var Car = function(){
 
        var speed, color, doors, pub;
 
        function setSpeed(new_speed) {
                speed = new_speed;
                return pub;
        }
 
        function setColor(new_color) {
                color = new_color;
                return pub;
        }
 
        function setDoors(new_doors) {
                doors = new_doors;
                return pub;
        }
 
        pub = {
                'setSpeed': setSpeed,
                'setColor': setColor,
                'setDoors': setDoors,
        };
 
        return pub;
 
};
 
// Fluent interface
myCar = Car();
myCar.setSpeed(100).setColor('blue').setDoors(5);
 
// Example without fluent interface
myCar2 = Car();
myCar2.setSpeed(100);
myCar2.setColor('blue');
myCar2.setDoors(5);

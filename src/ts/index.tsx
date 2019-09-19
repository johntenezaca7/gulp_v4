import Car from "./modules/example";

function helloIndex(compiler: string) {
  console.log(`Hello from ${compiler}`);
}

helloIndex('TypeScript. reload!');

var newCar = new Car();
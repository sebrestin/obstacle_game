import { Hero } from '../scripts/Elements';

describe("Test Hero behaviour", function() {

    let hero:Hero = new Hero();
  
    it("Test hero name", function() {
       expect(hero.name).toBe('Bird');
    });
});

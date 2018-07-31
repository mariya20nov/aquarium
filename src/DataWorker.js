export default function DataWorker(args) { // для передачи в таблицу двумерного массива ячеек
    let onmessage = e => { // eslint-disable-line no-unused-vars
      let arrCube = e.data.arrCube;
      let arrWater = e.data.arrWater;
      const data = [];
      const N = e.data.N;

      const obj2 = {}; // фундамент аквариума
      for( let j = 0; j < arrCube.length; j++) {
        obj2[j] = '@';
      }
      data.push(obj2);

      for( let i = 0; i < N; i++) {
        const obj = {};
        for( let j = 0; j < arrCube.length; j++) {
          obj[j] = ' ';
          if (i < arrCube[j]) {
            obj[j] = '+';
          } else if (i < (arrCube[j] + arrWater[j])) {
            obj[j] = '-';
          }
        }
        data.push(obj);
      }

      const obj = {}; // строчка вверху таблицы для отображения массива твердых кубиков
      for( let j = 0; j < arrCube.length; j++) {
        obj[j] = arrCube[j].toString();
      }
      data.push(obj);

      data.reverse();
      postMessage({data});
    }
}

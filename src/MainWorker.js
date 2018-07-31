export default function MainWorker(args) {
    let onmessage = e => { // eslint-disable-line no-unused-vars
      // основной алгоритм для получения общего числа водяных кубиков (value)
      // и массива распределения водяных кубиков arrWater

      let arrCube = e.data; // массив распределения твердых кубиков
      let value = 0; // количество водяных кубиков
      const arrWater = new Array(arrCube.length); // массив распределения водяных кубиков
      arrWater.fill(0);

      let max = Math.max.apply(null, arrCube); //находим максимальный по высоте столбик твердых кубиков
      let max_index = arrCube.indexOf(max);

      let maxL = arrCube[0]; // запоминаем высоту левого края (высоту нулевого столбца твердых кубиков)
      for( let i = 1; i < max_index; i++) { // идем с нулевого элемента до max
        if (arrCube[i] < maxL) { // если текущий столбик тв.к больше края
          value += maxL - arrCube[i]; // прибавляем к общему числу в.к разницу между краем и текущей высотой тв.к
          arrWater[i] = maxL - arrCube[i]; // и записываем её в массив водяных кубиков
        } else { // если текущий столбик тв.к меньше края
          maxL = arrCube[i]; // то текущее значение тв.к -> новый левый край
        }
      }

      let maxP = arrCube[arrCube.length - 1]; // запоминаем высоту правого края (высоту нулевого столбца твердых кубиков)
      for( let i = arrCube.length - 2; i > max_index; i--) { // идем с последнего элемента до max
        if (arrCube[i] < maxP) { // если текущий столбик тв.к больше края
          value += maxP - arrCube[i]; // прибавляем к общему числу в.к разницу между краем и текущей высотой тв.к
          arrWater[i] = maxP - arrCube[i];  // и записываем её в массив водяных кубиков
        } else { // если текущий столбик тв.к меньше края
          maxP = arrCube[i]; // то текущее значение тв.к -> новый правый край
        }
      }

      postMessage({arrWater: arrWater, value: value});
    };
}

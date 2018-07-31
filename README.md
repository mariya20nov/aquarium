- npm install
- npm start

Задача:
У Никиты был плоский аквариум с рыбками. В качестве украшения аквариума Никита использовал кубики, сложенные столбиками. После сильного хлопка дверью у аквариума выпали боковые стенки. При этом практически вся вода вылилась. Чтобы определить, не затопил ли Никита соседей снизу нужно посчитать, сколько воды осталось в аквариуме. Проблема в том, что аквариум очень большой. Ширина и высота аквариума достигает N=100000 кубиков.
Надо написать программу, которая по заданной конфигурации столбцов определяет объем оставшейся между кубиками воды.
На вход дается массив целых чисел – последовательная высота столбцов в аквариуме.
Результатом должно быть число – объем оставшейся воды между кубиками после того как вся вода слилась.
Например, для массива [4,2,3,2,5,0,1,3] результат должен быть равен 10

Решение:
Ответ - общее число водяных кубиков
Dropdown - выбрать N (длина массива твердых кубиков, числа в массиве генерируются рандомно)
Выбрать из файла *.txt - можно считать массив из файла (числа должны быть перечислены через запятую); для примера файл array.txt
Таблица - визуализация аквариума (использована react-table, не самое удачно решение (требуется заполнять передавать двумерный массив значений, а это уже O(N2), да и в общем работает медленно))

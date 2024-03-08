import React, { useState, useEffect } from 'react';
import { db } from './firebase-config'; // 引入Firebase配置
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const FoodList = () => {
  const [foods, setFoods] = useState([]);
  const [newFoodName, setNewFoodName] = useState('');
  const [newFoodRank, setNewFoodRank] = useState('');
  const foodsCollectionRef = collection(db, "foods");

  useEffect(() => {
    const getFoods = async () => {
      const data = await getDocs(foodsCollectionRef);
      setFoods(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })).sort((a, b) => a.order - b.order));
    };

    getFoods();
  }, []);

  const addFood = async (e) => {
    e.preventDefault();
    const order = foods.length > 0 ? Math.max(...foods.map(food => food.order)) + 1 : 0;
    await addDoc(foodsCollectionRef, { name: newFoodName, rank: newFoodRank, order });
    setNewFoodName('');
    setNewFoodRank('');
    await loadFoods();
  };

  const deleteFood = async (id) => {
    await deleteDoc(doc(db, "foods", id));
    await loadFoods();
  };

  const onDragEnd = async (result) => {
    if (!result.destination) return;

    const items = Array.from(foods);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // 更新数据库中的order字段
    for (let i = 0; i < items.length; i++) {
      await updateDoc(doc(db, "foods", items[i].id), {
        order: i
      });
    }

    await loadFoods();
  };

  const loadFoods = async () => {
    const data = await getDocs(foodsCollectionRef);
    setFoods(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })).sort((a, b) => a.order - b.order));
  };

  return (
    <>
      <div class="food-add">
      <form onSubmit={addFood}>
        <input type="text" placeholder="食物名稱" value={newFoodName} onChange={(e) => setNewFoodName(e.target.value)} required />
        <input type="text" placeholder="好吃程度" value={newFoodRank} onChange={(e) => setNewFoodRank(e.target.value)} required />
        <button type="submit">添加食物</button>
      </form>
      </div>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="foods">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {foods.map((food, index) => (
                <Draggable key={food.id} draggableId={food.id} index={index}>
                  {(provided) => (
                    <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} className="food-item">
                      {food.name} - {food.rank}
                      <button class="button-delete" onClick={() => deleteFood(food.id)}>X</button>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </>
  );
};

export default FoodList;

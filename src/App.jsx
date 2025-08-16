
import React, { useState } from "react";
import "./index.css";

export default function App() {
  const [role, setRole] = useState(""); // 身份选择
  const [todos, setTodos] = useState([]);
  const [shop, setShop] = useState([]);
  const [points, setPoints] = useState({ me: 0, partner: 0 });
  const [log, setLog] = useState([]);

  const [newTodo, setNewTodo] = useState("");
  const [newPoint, setNewPoint] = useState(1);
  const [specialEffect, setSpecialEffect] = useState(false);

  const [newWish, setNewWish] = useState("");
  const [newWishCost, setNewWishCost] = useState(1);

  if (!role) {
    return (
      <main className="app">
        <h2>请选择你的身份</h2>
        <button onClick={() => setRole("me")}>我是我</button>
        <button onClick={() => setRole("partner")}>我是对方</button>
      </main>
    );
  }

  const opposite = role === "me" ? "partner" : "me";

  function addTodo() {
    if (!newTodo.trim()) return;
    const todo = {
      id: Date.now(),
      text: newTodo,
      point: parseInt(newPoint),
      usedEffect: specialEffect,
      doneBy: null,
    };
    setTodos([...todos, todo]);
    setNewTodo("");
    setNewPoint(1);
    setSpecialEffect(false);
  }

  function completeTodo(id) {
    const updated = todos.map((t) =>
      t.id === id && !t.doneBy
        ? { ...t, doneBy: role }
        : t
    );
    setTodos(updated);

    const completed = updated.find((t) => t.id === id);
    const gain = completed.usedEffect ? completed.point + 1 : completed.point;
    setPoints({ ...points, [role]: points[role] + gain });
    setLog([
      ...log,
      `${role} 完成任务 "${completed.text}"，得分 ${gain}（原 ${completed.point}${
        completed.usedEffect ? "，特效+1" : ""
      }）`,
    ]);
  }

  function deleteTodo(id) {
    setTodos(todos.filter((t) => t.id !== id));
  }

  function addWish() {
    if (!newWish.trim()) return;
    const wish = {
      id: Date.now(),
      text: newWish,
      cost: parseInt(newWishCost),
      owner: role,
      redeemed: false,
    };
    setShop([...shop, wish]);
    setNewWish("");
    setNewWishCost(1);
  }

  function redeemWish(id) {
    const wish = shop.find((w) => w.id === id);
    if (wish.redeemed || points[role] < wish.cost) return;
    setShop(
      shop.map((w) =>
        w.id === id ? { ...w, redeemed: true } : w
      )
    );
    setPoints({ ...points, [role]: points[role] - wish.cost });
    setLog([
      ...log,
      `${role} 兑换了 "${wish.text}"，扣除积分 ${wish.cost}`,
    ]);
  }

  return (
    <main className="app">
      <h1>👯 Together Do</h1>
      <section className="role-section">
        <h2>你的身份：{role === "me" ? "我方" : "对方"}</h2>
        <p>当前积分：{points[role]}</p>
      </section>

      <section className="todo-section">
        <h2>待办任务</h2>
        <input
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="任务内容"
        />
        <input
          type="number"
          value={newPoint}
          onChange={(e) => setNewPoint(e.target.value)}
          placeholder="积分"
        />
        <label>
          <input
            type="checkbox"
            checked={specialEffect}
            onChange={(e) => setSpecialEffect(e.target.checked)}
          />
          迎难而上特效（+1分）
        </label>
        <button onClick={addTodo}>添加</button>

        <ul>
          {todos.map((t) => (
            <li key={t.id}>
              <span style={{ textDecoration: t.doneBy ? "line-through" : "none" }}>
                {t.text}（{t.point}分{t.usedEffect ? " +特效" : ""}）
              </span>
              {!t.doneBy && <button onClick={() => completeTodo(t.id)}>完成</button>}
              {!t.doneBy && <button onClick={() => deleteTodo(t.id)}>删除</button>}
              {t.doneBy && <em>由 {t.doneBy} 完成</em>}
            </li>
          ))}
        </ul>
      </section>

      <section className="shop-section">
        <h2>心愿商店</h2>
        <input
          value={newWish}
          onChange={(e) => setNewWish(e.target.value)}
          placeholder="愿望名称"
        />
        <input
          type="number"
          value={newWishCost}
          onChange={(e) => setNewWishCost(e.target.value)}
          placeholder="所需积分"
        />
        <button onClick={addWish}>添加</button>

        <ul>
          {shop
            .filter((w) => w.owner === role)
            .map((w) => (
              <li key={w.id}>
                {w.text}（{w.cost}分）
                {w.redeemed ? (
                  <em> 已兑换</em>
                ) : (
                  <button onClick={() => redeemWish(w.id)}>兑换</button>
                )}
              </li>
            ))}
        </ul>
      </section>

      <section className="panel-section">
        <h2>积分日志</h2>
        <ul>
          {log.map((entry, i) => (
            <li key={i}>{entry}</li>
          ))}
        </ul>
      </section>
    </main>
  );
}

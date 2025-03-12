## FlatBuffers 介紹

### 什麼是 FlatBuffers？
FlatBuffers 是由 Google 開發的一種高效的二進制序列化庫，主要用於需要 **快速解析** 數據的應用場景，如 **遊戲、移動應用、嵌入式設備、網絡傳輸** 等。它的核心特性是 **零拷貝（zero-copy）解析**，即在反序列化時不需要額外的內存分配，從而大幅提升性能。

---

### FlatBuffers 的特點
1. **極快的讀取速度**
   - 由於 FlatBuffers 使用零拷貝技術，數據可以直接從二進制緩衝區讀取，而不需要額外的反序列化步驟，這使其比 Protocol Buffers（Protobuf）和 JSON 更快。

2. **低內存開銷**
   - 傳統的序列化方式（如 JSON、XML）需要解析數據並將其轉換為內存中的結構，而 FlatBuffers 直接在二進制緩衝區中存儲結構，避免了額外的內存分配。

3. **跨平台支持**
   - 支持 C++, C#, C, Go, Java, JavaScript, Kotlin, Python, Rust, Swift, Dart 等多種語言，適用於各種應用場景。

4. **向後與向前兼容**
   - FlatBuffers 允許新增或刪除字段，而不影響舊版本的數據，這讓它非常適合需要持續迭代的應用。

5. **內建表與結構**
   - 提供類似 JSON 的結構（Table）以及更輕量的數據類型（Struct），可以根據需求選擇。

6. **不需要解析步驟**
   - 不同於 Protobuf 和 JSON，FlatBuffers 允許直接訪問二進制緩衝區中的數據，而無需解析和解碼。

---

### FlatBuffers vs. 其他序列化方案

| **特性**         | **FlatBuffers** | **Protocol Buffers (Protobuf)** | **JSON** |
|----------------|---------------|------------------------------|--------|
| **解析速度**   | 快（零拷貝）   | 中（需要反序列化）           | 慢（需要解析為物件） |
| **內存使用**   | 低（無需複製） | 中（需要反序列化存儲）       | 高（JSON 解析會產生許多臨時對象） |
| **可讀性**     | 低（原始二進制） | 低（二進制格式）             | 高（純文本） |
| **跨語言支持** | 是             | 是                           | 是      |
| **動態性**     | 低（需要事先定義結構） | 低（需要 .proto 文件）        | 高（可動態解析） |

---

### FlatBuffers 使用範例

#### 1. 定義 Schema
FlatBuffers 使用 `.fbs` 文件來定義數據結構。例如：

```fbs
// monster.fbs
namespace MyGame.Sample;

table Monster {
  pos: Vec3;
  mana: int = 150;
  hp: int = 100;
  name: string;
}

struct Vec3 {
  x: float;
  y: float;
  z: float;
}
```

#### 2. 生成代碼
使用 `flatc` 工具生成對應語言的代碼（以 C++ 為例）：

```sh
flatc --cpp monster.fbs
```

#### 3. 序列化數據
在 C++ 中使用 FlatBuffers 生成 Monster 的二進制數據：

```cpp
flatbuffers::FlatBufferBuilder builder;
auto name = builder.CreateString("Orc");

auto monster = CreateMonster(builder, 0, 200, 300, name);
builder.Finish(monster);

uint8_t* buf = builder.GetBufferPointer();
size_t size = builder.GetSize();
```

#### 4. 反序列化數據

```cpp
auto monster = GetMonster(buf);
std::cout << "Monster name: " << monster->name()->str() << std::endl;
```

---

### 適用場景
- **遊戲開發**：如 Unity、Unreal Engine 等，提升遊戲內數據讀取效率。
- **嵌入式系統**：適用於內存和性能受限的環境，如物聯網設備。
- **網絡通訊**：可作為 WebSocket 或 RPC 協議的序列化格式。
- **數據存儲**：適合低開銷的存儲需求，如緩存數據。

---

### 總結
FlatBuffers 是一種高效的序列化庫，特別適合 **高性能需求** 的場景，如遊戲、嵌入式開發、網絡通訊等。如果你的應用需要 **極快的數據解析、低內存開銷、跨平台支持**，那麼 FlatBuffers 會是一個很好的選擇。

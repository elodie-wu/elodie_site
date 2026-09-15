# Shell Stack 历史模块

这是之前的积木游戏，不是当前 Play 页运行的 Snake。保留旧算法、拖拽规则、五色积木、清行荧光和最高分存储，方便以后参考或恢复；没有从 `src/` 导入，因此不会进入网站运行包。

TypeScript 仍检查本目录，15 个旧测试仍由 `pnpm test` 执行。单独测试：

```powershell
pnpm exec vitest run legacy/shell-stack
```

| 原位置 | 归档位置 |
| --- | --- |
| `src/features/shell-stack/` | 本目录的视图和拖拽文件 |
| `src/game/` | `game/` |
| `src/services/bestScore*` | `bestScore*` |
| 原 `src/styles.css` 中的积木样式 | `shell-stack.css` |

## 恢复方式

1. 把整个模块复制到 `src/features/shell-stack/`，保留目录内部相对路径。
2. 在 `PlayPage.tsx` 导入新位置的 `ShellStackGame`，替换 Snake 或增加明确的游戏选择入口。
3. 调整页面面板样式并检查桌面、移动端；归档 CSS 不保证适配未来的外层布局。
4. 运行 `pnpm check` 和 `pnpm build`。若复制测试后保留归档测试，两套测试都会执行。

不要直接从 `src/` 导入 `legacy/`，架构检查会拒绝这种历史代码依赖。最高分存储是这个模块的功能，不是当前 Snake 的功能。

import {Node} from 'commonmark'

export const createWalker = () => {
  let nextId = 1
  let tocNode
  const toc = []
  const footnotes = {}

  function createFootnote(node) {
    const count = nextId++
    footnotes[node.firstChild.literal] = {text: node.destination, count}
    node.firstChild.literal = `[${count}]`
    node.insertBefore(node.firstChild)
    node.unlink()
  }

  return ({entering, node}: {entering: boolean, node: Node}) => {
    if (entering && node.type === 'Link' && !node.title) {

      if (node.destination === '#toc') {
        tocNode = node
      } else if (!node.firstChild || node.firstChild.type === 'Text') {
        createFootnote(node)
      }

    } else if (!entering && node.type === 'Heading' && tocNode) {
      toc.push(node)
    } else if (!entering && node.type === 'Document') {
      const ft = Object.values<any>(footnotes)
      ft.sort((a, b) => a.count - b.count)

      if (ft.length) {
        const paragraph = new Node('Paragraph')

        for (const {count, text} of ft) {
          const textNode = new Node('Text')
          textNode.literal = `[${count}] ${text}`
          paragraph.appendChild(textNode)
          paragraph.appendChild(new Node('Hardbreak'))
        }

        node.appendChild(paragraph)
      }

      if (tocNode) {
        const paragraph = new Node('Paragraph')
        const levelNumbers = [0]
        let lastLevel = 1

        for (const {firstChild: heading, level} of toc) {
          const textNode = new Node('Text')
          if (level < lastLevel) {
            do {
              levelNumbers.pop()
              lastLevel--
            } while (level < lastLevel)
          } else if (level > lastLevel) {
            do {
              levelNumbers.push(0)
              lastLevel++
            } while (level > lastLevel)
          }
          if (level === lastLevel) {
            const number = levelNumbers.pop() + 1
            levelNumbers.push(number)
          }
          heading.literal = `${levelNumbers.join('.')} ${heading.literal}`
          textNode.literal = heading.literal
          paragraph.appendChild(textNode)
          paragraph.appendChild(new Node('Hardbreak'))
        }

        tocNode.insertBefore(paragraph)
        tocNode.unlink()
      }
    }
  }
}

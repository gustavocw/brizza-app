import { type ReactNode } from 'react'
import { View } from 'react-native'
import { Paragraph } from '@/shared/components/ui/paragraph'
import { Title } from '@/shared/components/ui/title'

// Strip the inline markers these documents use (**bold**, `code`). Block-level
// only — enough for the LGPD terms/privacy markdown without a heavy dependency.
const inline = (t: string) => t.replace(/\*\*(.*?)\*\*/g, '$1').replace(/`(.*?)`/g, '$1').trim()

/** Minimal markdown: headings, bullets and paragraphs. */
export function Markdown({ content }: { content: string }) {
  const blocks: ReactNode[] = []

  content
    .replace(/\r\n/g, '\n')
    .split('\n')
    .forEach((line, i) => {
      const t = line.trim()
      if (!t) return

      if (t.startsWith('### ')) {
        blocks.push(
          <Paragraph key={i} appear={false} className="mt-3 text-base font-semibold text-foreground">
            {inline(t.slice(4))}
          </Paragraph>,
        )
      } else if (t.startsWith('## ')) {
        blocks.push(
          <Title key={i} appear={false} className="mt-4 text-lg">
            {inline(t.slice(3))}
          </Title>,
        )
      } else if (t.startsWith('# ')) {
        blocks.push(
          <Title key={i} appear={false} className="text-2xl">
            {inline(t.slice(2))}
          </Title>,
        )
      } else if (t.startsWith('- ') || t.startsWith('* ')) {
        blocks.push(
          <View key={i} className="flex-row gap-2 pl-1">
            <Paragraph appear={false} className="text-[15px] leading-6 text-muted">
              •
            </Paragraph>
            <Paragraph appear={false} className="flex-1 text-[15px] leading-6 text-muted">
              {inline(t.slice(2))}
            </Paragraph>
          </View>,
        )
      } else {
        blocks.push(
          <Paragraph key={i} appear={false} className="text-[15px] leading-6 text-muted">
            {inline(t)}
          </Paragraph>,
        )
      }
    })

  return <View className="gap-2">{blocks}</View>
}

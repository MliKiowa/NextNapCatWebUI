import type {
  AllOB11WsResponse,
  OB11AllEvent,
  OB11Request
} from '@/types/onebot'
import OneBotDisplayMeta from '@/components/onebot/display_card/meta'
import { getEventName, isOB11Event } from '@/utils/onebot'
import { timestampToDateString } from '@/utils/time'
import { motion } from 'motion/react'
import { Card, CardBody, CardHeader } from '@nextui-org/card'
import OneBotDisplayResponse from './response'
import { Button } from '@nextui-org/button'
import { Popover, PopoverTrigger, PopoverContent } from '@nextui-org/popover'
import { Snippet } from '@nextui-org/snippet'
import { IoCode } from 'react-icons/io5'
import OneBotNotice from './notice'
import OneBotMessage from './message'

const itemVariants = {
  hidden: { opacity: 0, scale: 0.8, y: 50 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 300, damping: 20 }
  }
}

function RequestComponent({ data: _ }: { data: OB11Request }) {
  return <div>Request消息，暂未适配</div>
}

export interface OneBotItemRenderProps {
  data: AllOB11WsResponse[]
  index: number
  style: React.CSSProperties
}

export const getItemSize = (event: OB11AllEvent['post_type']) => {
  if (event === 'meta_event') {
    return 100
  }
  if (event === 'message') {
    return 250
  }
  if (event === 'request') {
    return 100
  }
  if (event === 'notice') {
    return 100
  }
  if (event === 'message_sent') {
    return 250
  }
  return 100
}

const renderDetail = (data: AllOB11WsResponse) => {
  if (isOB11Event(data)) {
    switch (data.post_type) {
      case 'meta_event':
        return <OneBotDisplayMeta data={data} />
      case 'message':
        return <OneBotMessage data={data} />
      case 'request':
        return <RequestComponent data={data} />
      case 'notice':
        return <OneBotNotice data={data} />
      case 'message_sent':
        return <OneBotMessage data={data} />
      default:
        return <div>未知类型的消息</div>
    }
  }
  return <OneBotDisplayResponse data={data} />
}

const OneBotItemRender = ({ data, index, style }: OneBotItemRenderProps) => {
  const msg = data[index]
  const isEvent = isOB11Event(msg)
  return (
    <div style={style} className="p-2 overflow-visible w-full h-full">
      <motion.div
        variants={itemVariants}
        initial="hidden"
        animate="visible"
        className="h-full"
      >
        <Card className="w-full h-full py-2">
          <CardHeader className="py-0 text-default-500 flex-row gap-2">
            <div className="font-bold">
              {isEvent ? getEventName(msg.post_type) : '请求响应'}
            </div>
            <div className="text-sm">
              {isEvent && timestampToDateString(msg.time)}
            </div>
            <div className="ml-auto">
              <Popover
                placement="left"
                showArrow
                classNames={{
                  content: 'max-h-96 max-w-96 overflow-hidden p-0'
                }}
              >
                <PopoverTrigger>
                  <Button
                    size="sm"
                    color="danger"
                    variant="flat"
                    radius="full"
                    isIconOnly
                    className="text-medium"
                  >
                    <IoCode />
                  </Button>
                </PopoverTrigger>
                <PopoverContent>
                  <Snippet
                    hideSymbol
                    tooltipProps={{
                      content: '点击复制'
                    }}
                    classNames={{
                      copyButton: 'self-start sticky top-0 right-0'
                    }}
                    className="bg-content1 h-full overflow-y-scroll items-start"
                  >
                    {JSON.stringify(msg, null, 2)
                      .split('\n')
                      .map((line, i) => (
                        <span key={i} className="whitespace-pre-wrap break-all">
                          {line}
                        </span>
                      ))}
                  </Snippet>
                </PopoverContent>
              </Popover>
            </div>
          </CardHeader>
          <CardBody className="py-0">{renderDetail(msg)}</CardBody>
        </Card>
      </motion.div>
    </div>
  )
}

export default OneBotItemRender
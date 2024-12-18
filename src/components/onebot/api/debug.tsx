import { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import { OneBotHttpApiContent, OneBotHttpApiPath } from '@/const/ob_api'
import { parse, generateDefaultJson } from '@/utils/zod'
import DisplayStruct from './display_struct'
import { useLocalStorage } from '@uidotdev/usehooks'
import key from '@/const/key'
import { Input } from '@nextui-org/input'
import { Button } from '@nextui-org/button'
import { IoLink, IoSend } from 'react-icons/io5'
import { PiCatDuotone } from 'react-icons/pi'
import CodeEditor from '@/components/code_editor'
import { Card, CardBody, CardHeader } from '@nextui-org/card'
import { request } from '@/utils/request'
import { parseAxiosResponse } from '@/utils/url'
import toast from 'react-hot-toast'
import PageLoading from '@/components/page_loading'
import { Snippet } from '@nextui-org/snippet'

export interface OneBotApiDebugProps {
  path: OneBotHttpApiPath
  data: OneBotHttpApiContent
}

const OneBotApiDebug: React.FC<OneBotApiDebugProps> = (props) => {
  const { path, data } = props
  const [url] = useLocalStorage(key.storeURL, 'http://127.0.0.1:6099')
  const defaultHttpUrl = url.replace(':6099', ':3000')
  const [httpConfig, setHttpConfig] = useState({
    url: defaultHttpUrl,
    token: ''
  })
  const [requestBody, setRequestBody] = useState('{}')
  const [responseContent, setResponseContent] = useState('')
  const [isCodeEditorOpen, setIsCodeEditorOpen] = useState(false)
  const [isResponseOpen, setIsResponseOpen] = useState(false)
  const [isFetching, setIsFetching] = useState(false)
  const parsedRequest = parse(data.request)
  const parsedResponse = parse(data.response)

  const sendRequest = async () => {
    if (isFetching) return
    setIsFetching(true)
    const r = toast.loading('正在发送请求...')
    request
      .post(httpConfig.url + path, {
        headers: {
          Authorization: `Bearer ${httpConfig.token}`
        },
        responseType: 'text',
        body: requestBody
      })
      .then((res) => {
        setResponseContent(parseAxiosResponse(res))
      })
      .catch((err) => {
        setResponseContent(parseAxiosResponse(err.response))
      })
      .finally(() => {
        setIsFetching(false)
        toast.dismiss(r)
        toast.success('请求发送成功')
      })
  }

  useEffect(() => {
    setRequestBody(generateDefaultJson(data.request))
    setResponseContent('')
  }, [path])

  return (
    <div className="flex-1 overflow-y-auto p-4 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4 flex items-center gap-1 text-danger-400 ">
        <PiCatDuotone />
        {data.description}
      </h1>
      <h1 className="text-lg font-bold mb-4">
        <Snippet
          className="bg-default-50"
          symbol={<IoLink size={18} className="inline-block mr-1" />}
        >
          {path}
        </Snippet>
      </h1>
      <div className="flex gap-2 items-center">
        <Input
          label="HTTP URL"
          placeholder="输入 HTTP URL"
          value={httpConfig.url}
          onChange={(e) =>
            setHttpConfig({ ...httpConfig, url: e.target.value })
          }
        />
        <Input
          label="Token"
          placeholder="输入 Token"
          value={httpConfig.token}
          onChange={(e) =>
            setHttpConfig({ ...httpConfig, token: e.target.value })
          }
        />
        <Button
          onPress={sendRequest}
          color="danger"
          size="lg"
          radius="full"
          isIconOnly
          isDisabled={isFetching}
        >
          <IoSend />
        </Button>
      </div>
      <Card shadow="sm" className="my-4 dark:bg-[#1E1E1E]">
        <CardHeader className="font-noto-serif font-bold text-lg gap-1 pb-0">
          <span className="mr-2">请求体</span>
          <Button
            color="warning"
            variant="flat"
            onPress={() => setIsCodeEditorOpen(!isCodeEditorOpen)}
            size="sm"
            radius="full"
          >
            {isCodeEditorOpen ? '收起' : '展开'}
          </Button>
        </CardHeader>
        <CardBody>
          <motion.div
            className="overflow-hidden"
            initial={{ opacity: 0, height: 0 }}
            animate={{
              opacity: isCodeEditorOpen ? 1 : 0,
              height: isCodeEditorOpen ? 'auto' : 0
            }}
          >
            <CodeEditor
              value={requestBody}
              onChange={(value) => setRequestBody(value ?? '')}
              language="json"
              height="200px"
            />

            <div className="flex justify-end gap-1">
              <Button
                color="primary"
                variant="flat"
                onPress={() =>
                  setRequestBody(generateDefaultJson(data.request))
                }
              >
                填充示例请求体
              </Button>
            </div>
          </motion.div>
        </CardBody>
      </Card>
      <Card shadow="sm" className="my-4 relative">
        <PageLoading loading={isFetching} />
        <CardHeader className="font-noto-serif font-bold text-lg gap-1 pb-0">
          <span className="mr-2">响应</span>
          <Button
            color="warning"
            variant="flat"
            onPress={() => setIsResponseOpen(!isResponseOpen)}
            size="sm"
            radius="full"
          >
            {isResponseOpen ? '收起' : '展开'}
          </Button>
          <Button
            color="success"
            variant="flat"
            onPress={() => {
              navigator.clipboard.writeText(responseContent)
              toast.success('响应内容已复制到剪贴板')
            }}
            size="sm"
            radius="full"
          >
            复制
          </Button>
        </CardHeader>
        <CardBody>
          <motion.div
            className="overflow-y-auto text-sm"
            initial={{ opacity: 0, height: 0 }}
            animate={{
              opacity: isResponseOpen ? 1 : 0,
              height: isResponseOpen ? 300 : 0
            }}
          >
            <pre>
              <code>
                {responseContent || (
                  <div className="text-gray-400">暂无响应</div>
                )}
              </code>
            </pre>
          </motion.div>
        </CardBody>
      </Card>
      <div className="p-2 md:p-4 border border-default-50 rounded-lg">
        <h2 className="text-xl font-semibold mb-2">请求体结构</h2>
        <DisplayStruct schema={parsedRequest} />
        <h2 className="text-xl font-semibold mt-4 mb-2">响应体结构</h2>
        <DisplayStruct schema={parsedResponse} />
      </div>
    </div>
  )
}

export default OneBotApiDebug
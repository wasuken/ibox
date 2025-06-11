import { logging } from '@/lib/logging'
import * as cheerio from 'cheerio'
import type { NextApiRequest, NextApiResponse } from 'next'
import fetch from 'node-fetch'

function convPathToURL(baseurl: string, path: string) {
  if (path.startsWith('http')) {
    return path
  }
  let conj = ''
  if (path.startsWith('/')) {
    conj = ''
  } else {
    conj = '/'
  }
  return `${baseurl}${conj}${path}`
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  logging(req, res, async (req, res) => {
    if (req.method === 'GET') {
      const { css: _css, url: _url } = req.query
      const css = _css as string
      const url = _url as string
      const uurl = new URL(url)
      const response = await fetch(url)
      const body = await response.text()
      const $ = cheerio.load(body)
      let result: string[] = []
      const sp = css.split(' ')
      const lcmd = sp.pop()
      console.log(lcmd)
      $(css).each((_, e) => {
        if (lcmd === 'a') {
          const href = $(e).attr()?.href
          if (href) {
            const link = convPathToURL(uurl.origin, href)
            result.push(link)
          }
        } else if (lcmd === 'img') {
          const src = $(e).attr()?.src
          if (src) {
            const link = convPathToURL(uurl.origin, src)
            result.push(link)
          }
        }
      })
      // console.log('debug', result)
      res.status(200).json({ result, type: 'img' })
      return
    }
  })
}

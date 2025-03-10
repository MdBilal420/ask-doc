import Head from 'next/head'
import Layout from '../components/layout';
import DocsList from '../components/docs-list';
import PdfList from '../components/pdfs/pdfs-list';
import { useState } from 'react';
import AskDocs from '@/components/ask-docs';

export default function Home() {

  
  return (
    <div>
      <Head>
        <title>Ask Docs</title>
        <meta name="description" content="Ask Docs" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        {/* <DocsList /> */}
        <AskDocs />
      </Layout>
    </div>
  )
}
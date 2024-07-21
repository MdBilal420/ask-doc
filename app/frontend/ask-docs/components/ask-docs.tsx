import { useState } from "react";
import PdfList from "./pdfs/pdfs-list";
import Chat from "./chat/chat";

const AskDocs = () => {

    
    const [pdfs, setPdfs] = useState<any>([]);
  
    
    return (
        <>
        <PdfList pdfs={pdfs} setPdfs={setPdfs} />
        <Chat pdfs={pdfs} />
        </>
    )
}

export default AskDocs
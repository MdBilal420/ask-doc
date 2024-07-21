import { useState } from "react";

const cleanText = (text:string) => {
    return text.replace(/^"|"$/g, '').replace(/\\n/g, '').trim();
};
  
const CircularLoading = () => {
    return (
      <div className="flex items-center justify-center">
        <div className="animate-spin rounded-full h-20 w-20 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  };

const Chat = ({pdfs}:any) => {

    const [chatInput, setChatInput] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false)
    const [answer,setAnswer] = useState<string>("")

    async function handleChatSubmit  (event:any)  {
        event.preventDefault();
        setLoading(true)
        // Implement your chat submission logic here
        const selectedFile = pdfs.filter((pdf: { selected: boolean }) => pdf.selected)[0]
        const payload = {
            'question': chatInput
          }
        const res = await fetch(process.env.NEXT_PUBLIC_API_URL + `/pdfs/qa-pdf/${selectedFile.id}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload) 
        });
        if (res.ok && res.body) {
            const reader = res.body.getReader();
            const decoder = new TextDecoder();
            let result = '';

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                result += decoder.decode(value);                
            }
            const text = cleanText(result)
            setAnswer(text);
            setLoading(false)
          }
    };

console.log("loading",loading,answer)
    return (
        <div>
    <form onSubmit={handleChatSubmit} className="flex">
        <input
          type="text"
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          placeholder="Type your message..."
          className="flex-grow border border-gray-300 rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-r-lg"
        >
          Send
            </button>
            
            </form>
            <div className="w-lg mx-auto mt-4 p-6">
                {loading ?<CircularLoading /> :<p>{answer}</p>}
                </div>
        </div>
    )
}

export default Chat
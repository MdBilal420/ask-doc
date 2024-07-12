import { useState, useEffect, useCallback, useRef, ChangeEvent, KeyboardEvent } from 'react';
import { debounce } from 'lodash';
import Doc from './doc';

interface Doc {
  id: number;
  name: string;
  read: boolean;
}

export default function DocList() {
  const [docs, setDocs] = useState<Doc[] | null>(null);
  const [mainInput, setMainInput] = useState('');
  const [filter, setFilter] = useState<boolean | undefined>();
  const didFetchRef = useRef(false);

  useEffect(() => {
    if (didFetchRef.current === false) {
      didFetchRef.current = true;
      fetchTocs();
    }
  }, []);

  async function fetchTocs(read?: boolean) {
    let path = '/docs/all';
    
    const res = await fetch(process.env.NEXT_PUBLIC_API_URL + path)
    const json: Doc[] = await res.json();
    if (read !== undefined) {
      const unreadDocs = json?.filter((doc) => doc.read===read) ?? []
      setDocs(unreadDocs)
      return
    }
    setDocs(json);
  }

  const debouncedUpdateDoc = useCallback(debounce(updateDoc, 500), []);

  function handleDocChange(e: ChangeEvent<HTMLInputElement>, id: number) {
    const target = e.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name as keyof Doc;
    const copy = [...(docs || [])];
    const idx = docs?.findIndex((Doc) => Doc.id === id);
    if (idx !== undefined && idx >= 0) {
      const changedDoc: Doc = {
        ...copy[idx],
        [name]: value
      };
      copy[idx] = changedDoc;
      debouncedUpdateDoc(changedDoc);
      setDocs(copy);
    }
  }

  async function updateDoc(Doc: Doc) {
    const data = {
      name: Doc.name,
      read: Doc.read
    };
    await fetch(process.env.NEXT_PUBLIC_API_URL + `/docs/${Doc.id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  async function addDoc(name: string) {
    const res = await fetch(process.env.NEXT_PUBLIC_API_URL + `/docs/`, {
      method: 'POST',
      body: JSON.stringify({
        name: name,
        read: false
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    if (res.ok) {
      const json: Doc = await res.json();
      const copy = [...(docs || []), json];
      setDocs(copy);
    }
  }

  async function handleDeleteDoc(id: number) {
    const res = await fetch(process.env.NEXT_PUBLIC_API_URL + `/docs/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    if (res.ok) {
      const idx = docs?.findIndex((Doc) => Doc.id === id);
      if (idx !== undefined && idx >= 0) {
        const copy = [...(docs || [])];
        copy.splice(idx, 1);
        setDocs(copy);
      }
    }
  }

  function handleMainInputChange(e: ChangeEvent<HTMLInputElement>) {
    setMainInput(e.target.value);
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      if (mainInput.length > 0) {
        addDoc(mainInput);
        setMainInput('');
      }
    }
  }

  function handleFilterChange(value?: boolean) {
    setFilter(value);
    fetchTocs(value);
  }

  return (
    <div>
      <div>
        <input placeholder="What needs to be done?" value={mainInput} onChange={handleMainInputChange} onKeyDown={handleKeyDown} className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6" />
      </div>
      {!docs && (
        <div>Loading...</div>
      )}
      {docs && (
        <div>
          {docs.map((doc) => {
            return (
               <Doc key={doc.id} doc={doc} onDelete={handleDeleteDoc} onChange={handleDocChange} />
            )
          })}
        </div>
      )}
      <div>
        <button className="inline-flex items-center rounded-md bg-white my-2 px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:ring-gray-400" onClick={() => handleFilterChange()}>All</button>
        <button className="inline-flex items-center rounded-md bg-white mx-12 my-2 px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:ring-gray-400" onClick={() => handleFilterChange(false)}>Active</button>
        <button className="inline-flex items-center rounded-md bg-white mx-14 my-2 px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:ring-gray-400" onClick={() => handleFilterChange(true)}>Read</button>
      </div>
    </div>
  );
}

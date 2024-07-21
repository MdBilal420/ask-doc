import styles from '../../styles/pdf-list.module.css';
import { useState, useEffect, useCallback, useRef, SetStateAction } from 'react';
import { debounce } from 'lodash';
import PDFComponent from './pdf';

interface PDFListProps{
  pdfs: any
  setPdfs : any
}

export default function PdfList({pdfs,setPdfs}:PDFListProps) {
  const [selectedFile, setSelectedFile] = useState(null);
  
  const [filter, setFilter] = useState<any>();
  const didFetchRef = useRef(false);

  useEffect(() => {
    if (!didFetchRef.current) {
      didFetchRef.current = true;
      fetchPdfs(undefined);
    }
  }, []);

  async function fetchPdfs(selected:any) {
    let path = '/pdfs';
    if (selected !== undefined) {
      path = `/pdfs?selected=${selected}`;
    }
    const res = await fetch(process.env.NEXT_PUBLIC_API_URL + path);
    const json = await res.json();
    setPdfs(json);
  }

  const debouncedUpdatePdf = useCallback(debounce((pdf, fieldChanged) => {
    updatePdf(pdf, fieldChanged);
  }, 500), []);

  function handlePdfChange(e:any, id:number) {
    const target = e.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    const copy = [...pdfs];
    const idx = pdfs.findIndex((pdf:{id:number}) => pdf.id === id);
    const changedPdf = { ...pdfs[idx], [name]: value };
    copy[idx] = changedPdf;
    debouncedUpdatePdf(changedPdf, name);
    setPdfs(copy);
  }

  async function updatePdf(pdf: { [x: string]: any; id: any; }, fieldChanged: string | number) {
    const data = { [fieldChanged]: pdf[fieldChanged],name:pdf.name,file:pdf.file };

    await fetch(process.env.NEXT_PUBLIC_API_URL + `/pdfs/${pdf.id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' }
    });
  }

  async function handleDeletePdf(id:number) {
    const res = await fetch(process.env.NEXT_PUBLIC_API_URL + `/pdfs/${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' }
    });

    if (res.ok) {
      const copy = pdfs.filter((pdf:{id:number}) => pdf.id !== id);
      setPdfs(copy);
    }
  }

  const handleFileChange = (event:any) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async (event:any) => {
    event.preventDefault();
    if (!selectedFile) {
      alert("Please select file to load.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    const response = await fetch(process.env.NEXT_PUBLIC_API_URL + "/pdfs/upload", {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      const newPdf = await response.json();
      setPdfs([...pdfs, newPdf]);
    } else {
      alert("Error loading file.");
    }
  };

  function handleFilterChange(value: boolean | SetStateAction<undefined>) {
    setFilter(value);
    fetchPdfs(value);
  }

  return (
    <div className="w-lg mx-auto mt-10 p-6">
      <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
        <form onSubmit={handleUpload}>
          <input  type="file" accept=".pdf" onChange={handleFileChange} />
          <button  className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded cursor-pointer" type="submit">Load PDF</button>
        </form>
      </div>
      {!pdfs.length && <div>Loading...</div>}
      {pdfs.map((pdf:{id:number}) => (
        <PDFComponent key={pdf.id} pdf={pdf} onDelete={handleDeletePdf} onChange={handlePdfChange} />
      ))}
      <div className={styles.filters}>
        <button className={`${styles.filterBtn} ${filter === undefined && styles.filterActive}`} onClick={() => handleFilterChange(undefined)}>See All</button>
        <button className={`${styles.filterBtn} ${filter === true && styles.filterActive}`} onClick={() => handleFilterChange(true)}>See Selected</button>
        <button className={`${styles.filterBtn} ${filter === false && styles.filterActive}`} onClick={() => handleFilterChange(false)}>See Not Selected</button>
      </div>
    </div>
  );
}

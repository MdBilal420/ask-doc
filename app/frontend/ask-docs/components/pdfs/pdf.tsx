import Image from 'next/image';
import styles from '../../styles/pdf.module.css';

export default function PDFComponent(props:any) {
  const { pdf, onChange, onDelete } = props;
  return (
    <div className="mt-6 flex ">
      <input
        className={styles.pdfCheckbox}
        name="selected"
        type="checkbox"
        checked={pdf.selected}
        onChange={(e) => onChange(e, pdf.id)}
      />
      <input
        className={styles.pdfInput}
        autoComplete="off"
        name="name"
        type="text"
        value={pdf.name}
        onChange={(e) => onChange(e, pdf.id)}
      />
      <a
        href={pdf.file}
        target="_blank"
        rel="noopener noreferrer"
        className="bg-white shadow-sm ring-1 ring-inset ring-green-300 hover:ring-green-400 text-green-900 font-bold py-2 px-4 mx-2 rounded"
      >
        View
      </a>
      <button
        className="bg-white text-red-900 shadow-sm ring-1 ring-inset ring-red-300 hover:ring-red-400  font-bold py-2 px-4 mx-2 rounded"
        onClick={() => onDelete(pdf.id)}
      >
        Delete
      </button>
    </div>
  );
}

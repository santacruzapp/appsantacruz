import Papa from 'papaparse';
import { Ensalamento, Evento, FAQItem } from '../types';

const ENSALAMENTO_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTU6jxkbv59elM_0qLgfbHpiso5i6j73IJ7Fs_cz4j0VeP80c2-B5W_rMUd704zlGr0bRQsznZg0w7C/pub?output=csv';
const EVENTOS_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTf-j5SOyzwXXkJl7vrCnEtXgRbHDNYHRw07g8i-DlWMBCmVTBMigmkvAD8oPGtyafuRAPaZmcCuhkp/pub?output=csv';
const FAQ_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTan5gtVFXwccdEZk7JsuNZGw7nB-ZfT4DIdPnVlEp1gjEIIS0YY66TMhelEuqpu0jlrpISZjLPwPwE/pub?output=csv';

async function fetchCSV<T>(url: string): Promise<T[]> {
  const response = await fetch(url);
  const csvText = await response.text();
  
  return new Promise((resolve, reject) => {
    Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        resolve(results.data as T[]);
      },
      error: (error: Error) => {
        reject(error);
      }
    });
  });
}

export const sheetService = {
  async getEnsalamentos(): Promise<Ensalamento[]> {
    const data = await fetchCSV<any>(ENSALAMENTO_URL);
    return data
      .filter(item => item['Curso'] && item['Curso'].trim() !== '')
      .map(item => ({
        semestre: item['Semestre'] || '',
        curso: item['Curso'] || '',
        periodo: item['Período'] || '',
        disciplina: item['Disciplina'] || '',
        professor: item['Professor(a)'] || 'A definir',
        dia: item['Dia'] || '',
        horario: item['Horário'] || 'A definir',
        sala: item['Sala'] || 'A definir',
        turno: item['Turno'] || ''
      }));
  },

  async getEventos(): Promise<Evento[]> {
    const data = await fetchCSV<any>(EVENTOS_URL);
    return data.map(item => ({
      titulo: item['Evento'] || '',
      data: item['Data '] || item['Data'] || '',
      horario: item['Horario'] || item['Horário'] || '',
      descricao: item['Descrição Evento'] || item['Descrição'] || '',
      local: item['Local'] || ''
    }));
  },

  async getFAQ(): Promise<FAQItem[]> {
    const data = await fetchCSV<any>(FAQ_URL);
    return data.map(item => ({
      pergunta: item['FAQ'] || item['Pergunta'] || '',
      resposta: item['Descrição da FAQ'] || item['Resposta'] || '',
      categoria: item['Categoria'] || 'Geral'
    }));
  }
};

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Linkify from "linkify-react";
import { FaWhatsapp } from "react-icons/fa6";
import { 
  Search, 
  Calendar, 
  HelpCircle, 
  MapPin, 
  Clock, 
  ChevronRight, 
  ChevronDown, 
  X, 
  ArrowLeft,
  GraduationCap,
  MessageCircle,
  Info,
  Home
} from 'lucide-react';
import { sheetService } from './services/sheetService';
import { Ensalamento, Evento, FAQItem, View } from './types';

export default function App() {
  const [activeView, setActiveView] = useState<View>('home');
  const [loading, setLoading] = useState(true);
  const [showSplash, setShowSplash] = useState(true);

  // Data states
  const [ensalamentos, setEnsalamentos] = useState<Ensalamento[]>([]);
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [faq, setFaq] = useState<FAQItem[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [ensData, evData, faqData] = await Promise.all([
          sheetService.getEnsalamentos(),
          sheetService.getEventos(),
          sheetService.getFAQ()
        ]);
        setEnsalamentos(ensData);
        setEventos(evData);
        setFaq(faqData);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
        setTimeout(() => setShowSplash(false), 2000);
      }
    };
    loadData();
  }, []);

if (showSplash) {
    return (
      <div className="fixed inset-0 bg-primary flex flex-col items-center justify-center z-50">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          {/* Container da Logo na Splash */}
          <div className="w-48 h-48 flex items-center justify-center mb-6 mx-auto p-4">
            <img 
              src="/logo-branca.png" 
              alt="Santa Cruz" 
              className="w-full h-full object-contain"
            />
          </div>
          
          {/* Barra de carregamento minimalista (opcional, mas fica elegante) */}
          <motion.div 
            className="w-32 h-1 bg-white/20 rounded-full overflow-hidden mx-auto"
            initial={{ width: 0 }}
            animate={{ width: 128 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          >
            <motion.div 
              className="h-full bg-white"
              animate={{ x: [-128, 128] }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            />
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-white shadow-2xl relative overflow-hidden">
      <div className="flex-1 overflow-y-auto pb-24">
{/* Header */}
        <header className="px-6 pt-8 pb-4 bg-dark-blue overflow-visible">
          <div className="flex items-center justify-between mb-2">
            <div className="relative">
              <img 
                src="/logo-rosa.png"
                alt="Logo Santa Cruz" 
                className="h-24 w-auto object-contain -my-6" // h-24 aumenta a logo, -my-6 encolhe a borda azul
              />
            </div>
            <a
              href="https://wa.me/554130524900"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition"
           >
              <FaWhatsapp className="w-5 h-5 text-primary" />
            </a>
          </div>
        </header>
        {/* Main Content */}
        <main className="px-6 mt-4">
        <AnimatePresence mode="wait">
          {activeView === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <HomeView onNavigate={setActiveView} />
            </motion.div>
          )}
          {activeView === 'ensalamento' && (
            <motion.div
              key="ensalamento"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <EnsalamentoView data={ensalamentos} />
            </motion.div>
          )}
          {activeView === 'eventos' && (
            <motion.div
              key="eventos"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <EventosView data={eventos} />
            </motion.div>
          )}
          {activeView === 'faq' && (
            <motion.div
              key="faq"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <FAQView data={faq} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      </div>

      {/* Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t border-black/5 px-6 py-4 flex justify-between items-center z-20">
        <NavButton 
          active={activeView === 'home'} 
          onClick={() => setActiveView('home')}
          icon={<Home className="w-6 h-6" />}
          label="Início"
        />
        <NavButton 
          active={activeView === 'ensalamento'} 
          onClick={() => setActiveView('ensalamento')}
          icon={<Search className="w-6 h-6" />}
          label="Salas"
        />
        <NavButton 
          active={activeView === 'eventos'} 
          onClick={() => setActiveView('eventos')}
          icon={<Calendar className="w-6 h-6" />}
          label="Eventos"
        />
        <NavButton 
          active={activeView === 'faq'} 
          onClick={() => setActiveView('faq')}
          icon={<HelpCircle className="w-6 h-6" />}
          label="FAQ"
        />
      </nav>
    </div>
  );
}

function HomeView({ onNavigate }: { onNavigate: (view: View) => void }) {
  return (
    <div className="space-y-8 py-4">
      <div className="space-y-2">
        <h1 className="text-3xl text-primary tracking-tight">Olá, Estudante! 👋</h1>
        <p className="text-sm text-gray-700 leading-relaxed">
          Bem-vindo ao seu portal acadêmico. Aqui você encontra tudo o que precisa para o seu dia a dia na Santa Cruz.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <button 
          onClick={() => onNavigate('ensalamento')}
          className="card p-6 flex items-center gap-4 hover:bg-primary/5 transition-colors text-left group"
        >
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Search className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg">Consultar Salas</h3>
            <p className="text-xs text-gray-900">Encontre sua sala e professor</p>
          </div>
          <ChevronRight className="w-5 h-5 text-black/20" />
        </button>

        <button 
          onClick={() => onNavigate('eventos')}
          className="card p-6 flex items-center gap-4 hover:bg-primary/5 transition-colors text-left group"
        >
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Calendar className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg">Eventos</h3>
            <p className="text-xs text-gray-900">Fique por dentro do que acontece</p>
          </div>
          <ChevronRight className="w-5 h-5 text-black/20" />
        </button>

        <button 
          onClick={() => onNavigate('faq')}
          className="card p-6 flex items-center gap-4 hover:bg-primary/5 transition-colors text-left group"
        >
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
            <HelpCircle className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg">Dúvidas</h3>
            <p className="text-xs text-gray-900">Perguntas frequentes e suporte</p>
          </div>
          <ChevronRight className="w-5 h-5 text-black/20" />
        </button>
      </div>

      <div className="bg-primary/5 rounded-3xl p-6 border border-primary/10">
        <div className="flex items-center gap-3 mb-3">
          <Info className="w-5 h-5 text-primary" />
          <h4 className="font-bold text-sm text-primary uppercase tracking-wider">Dica do dia</h4>
        </div>
        <p className="text-sm text-gray-500 leading-relaxed">
          Mantenha seu portal sempre aberto para não perder nenhuma atualização de sala ou evento importante!
        </p>
      </div>
    </div>
  );
}

function NavButton({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
  return (
    <button 
      onClick={onClick}
      className={`flex flex-col items-center gap-1 transition-colors ${active ? 'text-primary' : 'text-black/30'}`}
    >
      {icon}
      <span className="text-[10px] font-bold uppercase tracking-widest">{label}</span>
      {active && (
        <motion.div 
          layoutId="nav-indicator"
          className="w-1 h-1 bg-primary rounded-full mt-1"
        />
      )}
    </button>
  );
}

// --- VIEWS ---

function EnsalamentoView({ data }: { data: Ensalamento[] }) {
  const [search, setSearch] = useState('');
  const [selectedCurso, setSelectedCurso] = useState<string | null>(null);
  const [selectedTurno, setSelectedTurno] = useState<string | null>(null);
  const [selectedPeriodo, setSelectedPeriodo] = useState<string | null>(null);

  // Filtered courses for initial list
  const uniqueCourses = useMemo(() => {
    const courses = Array.from(new Set(data.map(item => item.curso))).sort();
    if (!search) return courses;
    return courses.filter(c => c.toLowerCase().includes(search.toLowerCase()));
  }, [data, search]);

  // Available turnos for selected course
  const availableTurnos = useMemo(() => {
    if (!selectedCurso) return [];
    return Array.from(new Set(data.filter(item => item.curso === selectedCurso).map(item => item.turno))).sort();
  }, [data, selectedCurso]);

  // Available periodos for selected course + turno
  const availablePeriodos = useMemo(() => {
    if (!selectedCurso || !selectedTurno) return [];
    return Array.from(new Set(
      data.filter(item => item.curso === selectedCurso && item.turno === selectedTurno)
          .map(item => item.periodo)
    )).sort((a, b) => {
      const numA = parseInt(a) || 0;
      const numB = parseInt(b) || 0;
      return numA - numB;
    });
  }, [data, selectedCurso, selectedTurno]);

  // Final filtered schedule
  const schedule = useMemo(() => {
    if (!selectedCurso || !selectedTurno || !selectedPeriodo) return [];
    return data.filter(item => 
      item.curso === selectedCurso && 
      item.turno === selectedTurno && 
      item.periodo === selectedPeriodo
    );
  }, [data, selectedCurso, selectedTurno, selectedPeriodo]);

  // Group schedule by day
  const groupedSchedule = useMemo(() => {
    const order = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
    const groups: Record<string, Ensalamento[]> = {};
    
    schedule.forEach(item => {
      if (!groups[item.dia]) groups[item.dia] = [];
      groups[item.dia].push(item);
    });

    return Object.entries(groups).sort((a, b) => {
      return order.indexOf(a[0]) - order.indexOf(b[0]);
    });
  }, [schedule]);

  const handleSelectCurso = (curso: string) => {
    setSelectedCurso(curso);
    const turnos = Array.from(new Set(data.filter(item => item.curso === curso).map(item => item.turno)));
    if (turnos.length === 1) {
      setSelectedTurno(turnos[0]);
    } else {
      setSelectedTurno(null);
    }
    setSelectedPeriodo(null);
  };

  const reset = () => {
    setSelectedCurso(null);
    setSelectedTurno(null);
    setSelectedPeriodo(null);
    setSearch('');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Ensalamentos</h1>
        {(selectedCurso || search) && (
          <button onClick={reset} className="text-primary text-sm font-semibold flex items-center gap-1">
            <X className="w-4 h-4" /> Limpar
          </button>
        )}
      </div>

      {!selectedCurso ? (
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary" />
            <input 
              type="text" 
              placeholder="Buscar curso..." 
              className="input-search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button 
                onClick={() => setSearch('')}
                className="absolute right-4 top-1/2 -translate-y-1/2"
              >
                <X className="w-4 h-4 text-black/30" />
              </button>
            )}
          </div>

          <div className="space-y-2">
            {uniqueCourses.length > 0 ? (
              uniqueCourses.map(curso => (
                <button 
                  key={curso}
                  onClick={() => handleSelectCurso(curso)}
                  className="w-full text-left card flex items-center justify-between hover:border-primary/30 transition-colors group"
                >
                  <span className="font-medium">{curso}</span>
                  <ChevronRight className="w-5 h-5 text-primary group-hover:translate-x-1 transition-transform" />
                </button>
              ))
            ) : (
              <div className="text-center py-12 opacity-50">
                <Search className="w-12 h-12 mx-auto mb-2" />
                <p>Nenhum curso encontrado</p>
              </div>
            )}
          </div>
        </div>
      ) : !selectedTurno ? (
        <div className="space-y-4">
          <button onClick={() => setSelectedCurso(null)} className="flex items-center gap-2 text-primary font-semibold mb-2">
            <ArrowLeft className="w-4 h-4" /> Voltar
          </button>
          <h3 className="text-lg font-bold">{selectedCurso}</h3>
          <p className="text-sm text-gray-900">Selecione o turno:</p>
          <div className="grid grid-cols-2 gap-4">
            {availableTurnos.map(turno => (
              <button 
                key={turno}
                onClick={() => setSelectedTurno(turno)}
                className="card flex flex-col items-center justify-center py-8 gap-2 hover:border-primary/30 transition-colors"
              >
                <Clock className="w-8 h-8 text-primary" />
                <span className="font-bold">{turno}</span>
              </button>
            ))}
          </div>
        </div>
      ) : !selectedPeriodo ? (
        <div className="space-y-4">
          <button onClick={() => setSelectedTurno(null)} className="flex items-center gap-2 text-primary font-semibold mb-2">
            <ArrowLeft className="w-4 h-4" /> Voltar
          </button>
          <h3 className="text-lg font-bold">{selectedCurso}</h3>
          <div className="flex items-center gap-2 text-sm text-black/50">
            <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold text-[10px] uppercase">{selectedTurno}</span>
          </div>
          <p className="text-sm text-gray-900 mt-4">Selecione o período:</p>
          <div className="grid grid-cols-2 gap-3">
            {availablePeriodos.map(periodo => (
              <button 
                key={periodo}
                onClick={() => setSelectedPeriodo(periodo)}
                className="card text-center py-4 font-bold hover:border-primary/30 transition-colors"
              >
                {periodo}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <button onClick={() => setSelectedPeriodo(null)} className="flex items-center gap-2 text-primary font-semibold">
              <ArrowLeft className="w-4 h-4" /> Voltar
            </button>
          </div>
          
          <div className="space-y-1">
            <h3 className="text-xl font-bold leading-tight">{selectedCurso}</h3>
            <div className="flex items-center gap-2">
              <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold text-[10px] uppercase">{selectedTurno}</span>
              <span className="bg-black/5 text-black/60 px-2 py-0.5 rounded-full font-bold text-[10px] uppercase">{selectedPeriodo}</span>
            </div>
          </div>

          <div className="space-y-8 mt-6">
            {groupedSchedule.length > 0 ? (
              groupedSchedule.map(([dia, aulas]) => (
                <div key={dia} className="space-y-3">
                  <h4 className="text-primary font-bold uppercase tracking-widest text-xs flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                    {dia}
                  </h4>
                  <div className="space-y-3">
                    {aulas.map((aula, idx) => (
                      <div key={idx} className="card space-y-3">
                        <div>
                          <h5 className="font-bold text-base leading-tight text-primary">{aula.disciplina}</h5>
                          <p className="text-sm text-black mt-1.5 flex items-center gap-1.5">
                            <span className="font-semibold text-gray-900">Professor(a):</span> 
                            <span className="text-gray-900 font-medium">
                              {aula.professor || 'A definir'}
                            </span>  
                          </p>
                        </div>
                        <div className="grid grid-cols-2 gap-4 pt-3 border-t border-black/5">
                          <div className="flex items-center gap-2 text-xs font-medium text-black/60">
                            <Clock className="w-4 h-4 text-primary shrink-0" />
                            <div className="flex flex-col">
                              <span className="text-[10px] font-bold uppercase text-black/40">Horário</span>
                              <span className="text-black/80 font-bold">{aula.horario}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-xs font-medium text-black/60">
                            <MapPin className="w-4 h-4 text-primary shrink-0" />
                            <div className="flex flex-col">
                              <span className="text-[10px] font-bold uppercase text-black/40">Sala</span>
                              <span className="text-black/80 font-bold">{aula.sala}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 opacity-50">
                <Info className="w-12 h-12 mx-auto mb-2" />
                <p>Nenhum ensalamento encontrado para este curso.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function EventosView({ data }: { data: Evento[] }) {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Eventos Acadêmicos</h1>
      <div className="space-y-4">
        {data.length > 0 ? (
          data.map((evento, idx) => (
            <div key={idx} className="card space-y-4 overflow-hidden p-0">
              <div className="h-32 bg-primary/5 flex items-center justify-center">
                <Calendar className="w-12 h-12 text-primary/20" />
              </div>
              <div className="p-4 space-y-3">
                <div>
                  <h3 className="font-bold text-lg leading-tight">{evento.titulo}</h3>
                  <p className="text-sm text-gray-900 mt-2 line-clamp-3">{evento.descricao}</p>
                </div>
                <div className="flex flex-wrap gap-4 pt-3 border-t border-black/5">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-black">
                    <Calendar className="w-3.5 h-3.5 text-primary" />
                    {evento.data}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-black">
                    <Clock className="w-3.5 h-3.5 text-primary" />
                    {evento.horario}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-black">
                    <MapPin className="w-3.5 h-3.5 text-primary" />
                    {evento.local}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 opacity-50">
            <Calendar className="w-12 h-12 mx-auto mb-2" />
            <p>Nenhum evento programado</p>
          </div>
        )}
      </div>
    </div>
  );
}

function FAQView({ data }: { data: FAQItem[] }) {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  const categories = useMemo(() => {
    const cats: Record<string, FAQItem[]> = {};
    data.forEach(item => {
      if (!cats[item.categoria]) cats[item.categoria] = [];
      cats[item.categoria].push(item);
    });
    return Object.entries(cats);
  }, [data]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dúvidas Frequentes</h1>
      <div className="space-y-8">
        {categories.length > 0 ? (
          categories.map(([cat, items]) => (
            <div key={cat} className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-widest text-black/40 px-1">{cat}</h3>
              <div className="space-y-2">
                {items.map((item, idx) => {
                  const globalIdx = data.indexOf(item);
                  const isOpen = openIdx === globalIdx;
                  return (
                    <div key={idx} className="card p-0 overflow-hidden">
                      <button 
                        onClick={() => setOpenIdx(isOpen ? null : globalIdx)}
                        className="w-full text-left p-4 flex items-center justify-between gap-4"
                      >
                        <span className="font-bold text-sm">{item.pergunta}</span>
                        <ChevronDown className={`w-5 h-5 text-primary transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                      </button>
                      <AnimatePresence>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="px-4 pb-4 text-sm text-gray-900 leading-relaxed border-t border-black/10 pt-4">
                              <Linkify
                                options={{
                                  target: '_blank',
                                  rel: "noopener noreferrer",
                                  className: "text-primary underline font-medium"
                                }}
                              >
                                {item.resposta}
                              </Linkify>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 opacity-50">
            <HelpCircle className="w-12 h-12 mx-auto mb-2" />
            <p>Nenhuma informação disponível</p>
          </div>
        )}
      </div>
    </div>
  );
}

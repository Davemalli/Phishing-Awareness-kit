import React, { useState } from "react";
import { TrainingModule } from "../types";
import { BookOpen, CheckCircle2, Award, ArrowRight, Lightbulb, HelpCircle, Shield, Check, RefreshCw } from "lucide-react";
import confetti from "canvas-confetti";

interface TrainingCoursesProps {
  modules: TrainingModule[];
  completedModuleIds: string[];
  onCompleteModule: (moduleId: string, pointsAwarded: number) => void;
}

export const TrainingCourses: React.FC<TrainingCoursesProps> = ({
  modules,
  completedModuleIds,
  onCompleteModule,
}) => {
  const [selectedModuleId, setSelectedModuleId] = useState<string>(modules[0]?.id || "");
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<Record<string, boolean>>({});
  const [showCertificate, setShowCertificate] = useState<boolean>(false);

  const selectedModule = modules.find((m) => m.id === selectedModuleId) || modules[0];
  const isModuleCompleted = completedModuleIds.includes(selectedModule?.id);
  const allModulesCompleted = modules.length > 0 && modules.every((m) => completedModuleIds.includes(m.id));

  const handleSelectQuizOption = (questionId: string, optionIdx: number) => {
    if (quizSubmitted[selectedModule.id]) return;
    setQuizAnswers({
      ...quizAnswers,
      [questionId]: optionIdx,
    });
  };

  const handleSubmitQuiz = () => {
    if (!selectedModule) return;
    setQuizSubmitted({
      ...quizSubmitted,
      [selectedModule.id]: true,
    });

    const allCorrect = selectedModule.quiz.every(
      (q) => quizAnswers[q.id] === q.correctIndex
    );

    if (allCorrect) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
      onCompleteModule(selectedModule.id, 150);
    }
  };

  const handleResetQuiz = () => {
    setQuizSubmitted({
      ...quizSubmitted,
      [selectedModule.id]: false,
    });
    setQuizAnswers({});
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center border border-blue-100">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Security Awareness Micro-Courses</h2>
              <p className="text-xs text-slate-500">
                Interactive training modules designed to build threat identification reflexes.
              </p>
            </div>
          </div>
        </div>

        {allModulesCompleted && (
          <button
            onClick={() => setShowCertificate(true)}
            className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-lg text-xs shadow-sm transition-all cursor-pointer"
          >
            <Award className="w-4 h-4" />
            <span>View Defender Certificate 🏆</span>
          </button>
        )}
      </div>

      {/* Main Grid: Modules Roster (Left 4) + Lesson Reader (Right 8) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Module Selector Sidebar */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500 px-2">
            Curriculum ({completedModuleIds.length} of {modules.length} Passed)
          </div>

          <div className="space-y-2">
            {modules.map((mod, idx) => {
              const isSelected = mod.id === selectedModule?.id;
              const isDone = completedModuleIds.includes(mod.id);

              return (
                <button
                  key={mod.id}
                  onClick={() => setSelectedModuleId(mod.id)}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-start gap-3 cursor-pointer ${
                    isSelected
                      ? "bg-blue-50/70 border-blue-500 text-slate-900 shadow-xs"
                      : "bg-white border-slate-200 hover:bg-slate-50 text-slate-700"
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-base shrink-0">
                    {mod.icon}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="text-[10px] uppercase font-bold text-slate-400">
                        Module {idx + 1}
                      </span>
                      <span className="text-[10px] text-slate-400">{mod.readTime}</span>
                    </div>

                    <div className="font-semibold text-xs text-slate-900 leading-tight mb-1">
                      {mod.title}
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-slate-500">
                      <span>{mod.category}</span>
                      {isDone && (
                        <span className="flex items-center gap-1 text-green-600 font-bold">
                          <CheckCircle2 className="w-3 h-3" /> Passed
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Lesson & Quiz Viewer */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-xl p-6 sm:p-8 shadow-sm space-y-6">
          {selectedModule && (
            <>
              {/* Module Header */}
              <div className="border-b border-slate-100 pb-5 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 font-semibold border border-blue-100">
                    {selectedModule.category}
                  </span>
                  <span className="text-xs text-slate-400">&bull; {selectedModule.readTime}</span>
                  <span className="text-xs text-slate-400">&bull; {selectedModule.difficulty}</span>
                </div>

                <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                  {selectedModule.title}
                </h1>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {selectedModule.summary}
                </p>
              </div>

              {/* Lesson Sections */}
              <div className="space-y-6">
                {selectedModule.lessons.map((lesson, lIdx) => (
                  <div key={lIdx} className="bg-slate-50/70 border border-slate-200 rounded-xl p-5 sm:p-6 space-y-3">
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
                        {lIdx + 1}
                      </span>
                      <span>{lesson.title}</span>
                    </h3>

                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                      {lesson.content}
                    </p>

                    <div className="space-y-1.5 pt-1">
                      {lesson.bulletPoints.map((pt, pIdx) => (
                        <div key={pIdx} className="text-xs text-slate-600 flex items-start gap-2">
                          <span className="text-blue-600 mt-0.5 font-bold">&bull;</span>
                          <span>{pt}</span>
                        </div>
                      ))}
                    </div>

                    <div className="bg-blue-50 border border-blue-100 p-3.5 rounded-lg text-xs text-blue-900 flex items-start gap-2.5 mt-3">
                      <Lightbulb className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-blue-950 font-semibold">Pro-Tip: </strong>
                        <span>{lesson.proTip}</span>
                      </div>
                    </div>

                    {lesson.realExample && (
                      <div className="bg-white p-3 rounded-lg border border-slate-200 text-xs text-slate-600 italic">
                        🔍 Case Study: "{lesson.realExample}"
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* End of Module Knowledge Check Quiz */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 space-y-5">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <div className="flex items-center gap-2">
                    <HelpCircle className="w-5 h-5 text-blue-600" />
                    <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                      Module Verification Quiz
                    </h3>
                  </div>
                  <span className="text-xs font-semibold text-amber-600">+150 PhishIQ Points</span>
                </div>

                <div className="space-y-5">
                  {selectedModule.quiz.map((q, qIdx) => {
                    const selectedOpt = quizAnswers[q.id];
                    const isSubmitted = quizSubmitted[selectedModule.id];
                    const isCorrect = selectedOpt === q.correctIndex;

                    return (
                      <div key={q.id} className="space-y-2.5">
                        <div className="font-semibold text-xs sm:text-sm text-slate-900 flex items-start gap-2">
                          <span className="text-blue-600 font-bold">Q{qIdx + 1}.</span>
                          <span>{q.question}</span>
                        </div>

                        <div className="space-y-2">
                          {q.options.map((opt, optIdx) => {
                            let btnStyle = "bg-white border-slate-200 text-slate-700 hover:bg-slate-100";
                            if (selectedOpt === optIdx) {
                              btnStyle = "bg-blue-50 border-blue-500 text-blue-900 font-medium";
                            }
                            if (isSubmitted) {
                              if (optIdx === q.correctIndex) {
                                btnStyle = "bg-green-100 border-green-400 text-green-900 font-bold";
                              } else if (selectedOpt === optIdx) {
                                btnStyle = "bg-red-100 border-red-400 text-red-900 line-through";
                              }
                            }

                            return (
                              <button
                                key={optIdx}
                                disabled={isSubmitted}
                                onClick={() => handleSelectQuizOption(q.id, optIdx)}
                                className={`w-full text-left px-4 py-2.5 rounded-lg border text-xs transition-all flex items-center justify-between cursor-pointer ${btnStyle}`}
                              >
                                <span>{opt}</span>
                                {isSubmitted && optIdx === q.correctIndex && (
                                  <Check className="w-4 h-4 text-green-600 shrink-0 ml-2" />
                                )}
                              </button>
                            );
                          })}
                        </div>

                        {isSubmitted && (
                          <div className={`p-3 rounded-lg text-xs border ${isCorrect ? "bg-green-50 border-green-200 text-green-800" : "bg-amber-50 border-amber-200 text-amber-800"}`}>
                            <div className="font-semibold mb-0.5">{isCorrect ? "✅ Correct!" : "⚠️ Explanation:"}</div>
                            <div>{q.explanation}</div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Submit / Retry Actions */}
                <div className="pt-2 flex items-center justify-between">
                  {!quizSubmitted[selectedModule.id] ? (
                    <button
                      onClick={handleSubmitQuiz}
                      disabled={selectedModule.quiz.some((q) => quizAnswers[q.id] === undefined)}
                      className="px-5 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium rounded-lg text-xs shadow-sm transition-all ml-auto cursor-pointer"
                    >
                      Submit Answers
                    </button>
                  ) : (
                    <button
                      onClick={handleResetQuiz}
                      className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg text-xs font-medium ml-auto cursor-pointer shadow-xs"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Retake Quiz</span>
                    </button>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Completion Credential Modal */}
      {showCertificate && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-xl w-full p-8 shadow-2xl space-y-6 text-center text-slate-800 relative">
            <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-600 flex items-center justify-center text-white shadow-lg shadow-amber-500/20">
              <Award className="w-8 h-8" />
            </div>

            <div>
              <span className="text-xs uppercase font-bold text-amber-600 tracking-widest">
                Certificate of Cybersecurity Excellence
              </span>
              <h2 className="text-2xl font-bold text-slate-900 mt-1">
                Certified PhishGuard Defender
              </h2>
              <p className="text-xs text-slate-500 mt-2 max-w-md mx-auto">
                Awarded for successfully mastering email forensics, deceptive domain identification, and next-generation attack vectors.
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 flex justify-around">
              <div>
                <div className="text-slate-400 text-[10px] uppercase font-semibold">Awarded On</div>
                <div className="font-semibold text-slate-900 mt-0.5">{new Date().toLocaleDateString()}</div>
              </div>
              <div className="border-r border-slate-200" />
              <div>
                <div className="text-slate-400 text-[10px] uppercase font-semibold">Credential ID</div>
                <div className="font-mono text-blue-600 font-bold mt-0.5">PG-DEF-{Date.now().toString().slice(-6)}</div>
              </div>
            </div>

            <button
              onClick={() => setShowCertificate(false)}
              className="px-6 py-2 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-lg text-xs transition-colors cursor-pointer"
            >
              Close Credential
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

import { Bot, Send, Sparkles, User } from "lucide-react";
import { useEffect, useRef } from "react";

const AIChatWindow = ({ messages, input, setInput, onSend, loading }) => {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, loading]);

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!input.trim() || loading) {
      return;
    }

    onSend();
  };

  return (
    <div className="fixed bottom-24 right-4 z-50 flex h-[min(620px,calc(100vh-120px))] w-[calc(100vw-32px)] max-w-[420px] flex-col overflow-hidden rounded-2xl border border-[#DDE1E6] bg-white shadow-2xl shadow-black/10 md:bottom-24 md:right-6">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-[#E1E5EA] bg-white px-4 py-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#EEF1FF] text-[#6072D8]">
          <Bot size={21} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h2 className="truncate text-sm font-semibold text-[#20252D]">
              Career Lens AI{" "}
            </h2>

            <span className="flex items-center gap-1 rounded-full bg-[#EEF1FF] px-2 py-0.5 text-[10px] font-medium text-[#6072D8]">
              <Sparkles size={10} />
              AI
            </span>
          </div>

          <p className="mt-0.5 text-xs text-[#667085]">
            Your career & learning assistant
          </p>
        </div>

        <div className="flex items-center gap-1.5 text-[10px] text-[#667085]">
          <span className="h-2 w-2 rounded-full bg-green-500" />
          Online
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto bg-[#F8F9FB] px-4 py-4">
        {messages.length === 0 && (
          <div className="flex min-h-full flex-col items-center justify-center px-4 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EEF1FF] text-[#6072D8]">
              <Bot size={28} />
            </div>

            <h3 className="mt-4 text-base font-semibold text-[#20252D]">
              How can I help?
            </h3>

            <p className="mt-2 max-w-[280px] text-xs leading-5 text-[#667085]">
              Ask me about coding, your skill gaps, projects, interviews, career
              readiness, or job safety.
            </p>

            <div className="mt-5 grid w-full max-w-[320px] gap-2">
              <button
                type="button"
                onClick={() => setInput("Explain React in simple terms")}
                className="rounded-xl border border-[#DDE1E6] bg-white px-3 py-2.5 text-left text-xs text-[#4B5563] transition hover:border-[#AEB8EE] hover:bg-[#EEF1FF]"
              >
                Explain React in simple terms
              </button>

              <button
                type="button"
                onClick={() =>
                  setInput("How should I improve my current skill gaps?")
                }
                className="rounded-xl border border-[#DDE1E6] bg-white px-3 py-2.5 text-left text-xs text-[#4B5563] transition hover:border-[#AEB8EE] hover:bg-[#EEF1FF]"
              >
                How should I improve my skill gaps?
              </button>

              <button
                type="button"
                onClick={() =>
                  setInput("Give me an interview question for my target role")
                }
                className="rounded-xl border border-[#DDE1E6] bg-white px-3 py-2.5 text-left text-xs text-[#4B5563] transition hover:border-[#AEB8EE] hover:bg-[#EEF1FF]"
              >
                Give me an interview question
              </button>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {messages.map((message, index) => {
            const isUser = message.role === "user";

            return (
              <div
                key={`${message.role}-${index}`}
                className={`flex items-start gap-2.5 ${
                  isUser ? "justify-end" : "justify-start"
                }`}
              >
                {!isUser && (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#EEF1FF] text-[#6072D8]">
                    <Bot size={16} />
                  </div>
                )}

                <div
                  className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm leading-6 ${
                    isUser
                      ? "rounded-br-md bg-[#6072D8] text-white"
                      : "rounded-bl-md border border-[#E1E5EA] bg-white text-[#343A46]"
                  }`}
                >
                  {message.content}
                </div>

                {isUser && (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#343A46] text-white">
                    <User size={15} />
                  </div>
                )}
              </div>
            );
          })}

          {loading && (
            <div className="flex items-start gap-2.5">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#EEF1FF] text-[#6072D8]">
                <Bot size={16} />
              </div>

              <div className="rounded-2xl rounded-bl-md border border-[#E1E5EA] bg-white px-4 py-3">
                <div className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#6072D8]" />
                  <span
                    className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#6072D8]"
                    style={{ animationDelay: "120ms" }}
                  />
                  <span
                    className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#6072D8]"
                    style={{ animationDelay: "240ms" }}
                  />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <form
        onSubmit={handleSubmit}
        className="border-t border-[#E1E5EA] bg-white p-3"
      >
        <div className="flex items-end gap-2 rounded-xl border border-[#DDE1E6] bg-[#F8F9FB] p-1.5 transition focus-within:border-[#91A0F0]">
          <textarea
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                handleSubmit(event);
              }
            }}
            placeholder="Ask Career Lens AI..."
            rows={1}
            className="max-h-24 min-h-[40px] flex-1 resize-none border-0 bg-transparent px-2.5 py-2 text-sm text-[#20252D] outline-none placeholder:text-[#98A2B3]"
          />

          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#6072D8] text-white transition hover:bg-[#5264CC] disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Send message"
          >
            <Send size={17} />
          </button>
        </div>

        <p className="mt-2 px-1 text-[10px] leading-4 text-[#98A2B3]">
          Career Lens AI can make mistakes. Verify important information.
        </p>
      </form>
    </div>
  );
};

export default AIChatWindow;

"use client";

import { ChangeEvent, FormEvent, useRef } from "react";

type BingoSetupModalProps = {
  idLoading: boolean;
  onSubmit(dimensions: number): void;
  onCancel(): void;
};

export function BingoSetupModal({
  idLoading,
  onCancel,
  onSubmit,
}: BingoSetupModalProps) {
  const dimsInputRef = useRef<HTMLInputElement>(null);

  const handleDimChange = (evt: ChangeEvent<HTMLInputElement>) => {
    if (!dimsInputRef.current) return;

    const currentValue = evt.target.value;
    if (currentValue && Number.isInteger(+currentValue)) {
      dimsInputRef.current.value = currentValue;
    } else {
      dimsInputRef.current.value = dimsInputRef.current.value.replace(
        /[a-z][A-Z]*/g,
        ""
      );
    }
  };

  const handleCreateBingoClick = (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault();

    if (!dimsInputRef.current) return;

    const bingoDimensions = dimsInputRef.current.value;
    onSubmit(+bingoDimensions);
  };

  return (
    <div
      className="relative z-10 "
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <div className="relative transform overflow-hidden rounded-lg bg-zinc-900 text-gray-200 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
            <form onSubmit={handleCreateBingoClick}>
              <div className="px-4 pt-4">
                <h2 className="text-base font-semibold leading-7">
                  Configurações do bingo
                </h2>
                <div className="border-b border-gray-900/10 py-8">
                  <div className="sm:col-span-4">
                    <label
                      htmlFor="dimensions"
                      className="block text-sm font-medium leading-6"
                    >
                      Dimensões
                    </label>
                    <div className="flex mt-2 w-4/6 rounded-md ring-1 ring-inset ring-gray-300 focus-within:ring-purple-600 outline-none">
                      <input
                        ref={dimsInputRef}
                        className="block flex-1 border-0 bg-transparent py-1.5 px-2 placeholder:text-gray-400 sm:text-sm sm:leading-6 outline-none"
                        placeholder="Insira as dimensões do bingo"
                        type="text"
                        name="dimensions"
                        id="dimensions"
                        onChange={handleDimChange}
                        defaultValue={4}
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800 px-4 py-3 flex items-center justify-end gap-x-6">
                <button
                  type="button"
                  className="text-sm font-semibold leading-6"
                  onClick={onCancel}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="py-2 px-3 text-sm text-white bg-purple-900 rounded-md h-auto font-semibold"
                >
                  {idLoading ? "Criando..." : "Criar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

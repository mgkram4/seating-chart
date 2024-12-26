"use client"

import { useEffect, useState } from 'react';

type SectionType = 'left' | 'bottom' | 'rightTop' | 'rightBottom';

interface Seat {
  name: string | null;
  number: number;
}

interface Sections {
  left: Seat[];
  bottom: Seat[];
  rightTop: Seat[];
  rightBottom: Seat[];
}

interface SeatingChartProps {
  initialData?: Sections;
  onSeatUpdate?: (seats: Sections) => void;
}

interface SelectedSeat {
  section: SectionType;
  index: number;
}

interface FormData {
  name: string;
}

interface SeatProps {
  occupied: string | null;
  onClick: () => void;
  selected: boolean;
  number: number;
}

const SeatingChart: React.FC<SeatingChartProps> = ({ initialData, onSeatUpdate }) => {
  const createNumberedSeats = (count: number, startNumber: number): Seat[] => {
    return Array(count).fill(null).map((_, i) => ({
      name: null,
      number: startNumber + i
    }));
  };

  const [seats, setSeats] = useState<Sections>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('seatingChart');
      return saved ? JSON.parse(saved) : initialData || {
        left: createNumberedSeats(36, 1),
        bottom: createNumberedSeats(63, 37),
        rightTop: createNumberedSeats(14, 100),
        rightBottom: createNumberedSeats(14, 114)
      };
    }
    return initialData || {
      left: createNumberedSeats(36, 1),
      bottom: createNumberedSeats(63, 37),
      rightTop: createNumberedSeats(14, 100),
      rightBottom: createNumberedSeats(14, 114)
    };
  });

  useEffect(() => {
    localStorage.setItem('seatingChart', JSON.stringify(seats));
  }, [seats]);

  const [selectedSeat, setSelectedSeat] = useState<SelectedSeat | null>(null);
  const [formData, setFormData] = useState<FormData>({ name: '' });

  const handleSeatClick = (section: SectionType, index: number) => {
    setSelectedSeat({ section, index });
    setFormData({ name: seats[section][index]?.name || '' });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSeat) return;

    const { section, index } = selectedSeat;
    const newSeats = {
      ...seats,
      [section]: [
        ...seats[section].slice(0, index),
        { ...seats[section][index], name: formData.name || null },
        ...seats[section].slice(index + 1)
      ]
    };
    setSeats(newSeats);
    onSeatUpdate?.(newSeats);
    setSelectedSeat(null);
    setFormData({ name: '' });
  };

  const handleRemove = () => {
    if (!selectedSeat) return;
    const { section, index } = selectedSeat;
    const newSeats = {
      ...seats,
      [section]: [
        ...seats[section].slice(0, index),
        { ...seats[section][index], name: null },
        ...seats[section].slice(index + 1)
      ]
    };
    setSeats(newSeats);
    onSeatUpdate?.(newSeats);
    setSelectedSeat(null);
    setFormData({ name: '' });
  };

  const Seat: React.FC<SeatProps> = ({ occupied, onClick, selected, number }) => (
    <div
      onClick={onClick}
      className={`w-6 h-6 border-2 rounded-lg m-0.5 flex items-center justify-center cursor-pointer text-xs
        ${occupied ? 'bg-blue-500 text-white' : number >= 44 && number <= 73 ? 'bg-green-500' : 'bg-gray-100'}
        ${selected ? 'border-red-500' : 'border-gray-300'}
        hover:border-blue-500 transition-colors relative`}
    >
      {occupied ? '👤' : ''}
      <span className="absolute -top-4 text-[10px] text-gray-500">{number}</span>
    </div>
  );

  return (
    <div className="p-4 w-full max-w-6xl mx-auto">
      <div className="bg-gray-200 rounded-lg p-4">
        <div className="grid grid-cols-[200px_1fr_200px] gap-4">
          {/* Left Section - Vertical */}
          <div className="flex flex-col">
            <div className="text-sm font-medium mb-2">Left Section</div>
            <div className="grid grid-cols-4 gap-0.5">
              {seats.left.map((seat, i) => (
                <Seat
                  key={`left-${i}`}
                  occupied={seat.name}
                  selected={selectedSeat?.section === 'left' && selectedSeat?.index === i}
                  onClick={() => handleSeatClick('left', i)}
                  number={seat.number}
                />
              ))}
            </div>
          </div>

          {/* Center Area */}
          <div className="flex flex-col">
            <div className="bg-blue-200 p-2 rounded mb-4 text-center">Players Area</div>
            <div className="flex-grow bg-blue-100 rounded"></div>
            
            {/* Bottom Section - Horizontal */}
            <div className="mt-4">
              <div className="text-sm font-medium mb-2">Bottom Section</div>
              <div className="flex flex-wrap justify-center">
                {seats.bottom.map((seat, i) => (
                  <Seat
                    key={`bottom-${i}`}
                    occupied={seat.name}
                    selected={selectedSeat?.section === 'bottom' && selectedSeat?.index === i}
                    onClick={() => handleSeatClick('bottom', i)}
                    number={seat.number}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Right Sections - Vertical */}
          <div className="flex flex-col">
            <div>
              <div className="text-sm font-medium mb-2">Right Top Section</div>
              <div className="grid grid-cols-4 gap-0.5">
                {seats.rightTop.map((seat, i) => (
                  <Seat
                    key={`rightTop-${i}`}
                    occupied={seat.name}
                    selected={selectedSeat?.section === 'rightTop' && selectedSeat?.index === i}
                    onClick={() => handleSeatClick('rightTop', i)}
                    number={seat.number}
                  />
                ))}
              </div>
            </div>
            
            <div className="mt-4">
              <div className="text-sm font-medium mb-2">Right Bottom Section</div>
              <div className="grid grid-cols-4 gap-0.5">
                {seats.rightBottom.map((seat, i) => (
                  <Seat
                    key={`rightBottom-${i}`}
                    occupied={seat.name}
                    selected={selectedSeat?.section === 'rightBottom' && selectedSeat?.index === i}
                    onClick={() => handleSeatClick('rightBottom', i)}
                    number={seat.number}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <form onSubmit={handleSubmit} className="flex gap-4 items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {selectedSeat ? 'Edit Seat' : 'Select a seat'}
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ name: e.target.value })}
                placeholder="Enter name"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                disabled={!selectedSeat}
              />
            </div>
            <button
              type="submit"
              disabled={!selectedSeat}
              className="px-4 py-2 bg-black text-white rounded-full disabled:opacity-50"
            >
              Save
            </button>
            <button
              type="button"
              onClick={handleRemove}
              disabled={!selectedSeat}
              className="px-4 py-2 border border-gray-300 rounded-full disabled:opacity-50"
            >
              Remove
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SeatingChart;
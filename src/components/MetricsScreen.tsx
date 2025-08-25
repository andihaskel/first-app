import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';
import { ArrowLeftIcon, TrendingUpIcon } from 'lucide-react';
interface MetricsScreenProps {
  onGoBack: () => void;
}
const MetricsScreen: React.FC<MetricsScreenProps> = ({
  onGoBack
}) => {
  // Sample data for the chart
  const data = [{
    name: 'Lun',
    intentos: 8,
    foco: 5
  }, {
    name: 'Mar',
    intentos: 10,
    foco: 6
  }, {
    name: 'Mié',
    intentos: 7,
    foco: 4
  }, {
    name: 'Jue',
    intentos: 12,
    foco: 8
  }, {
    name: 'Vie',
    intentos: 9,
    foco: 7
  }, {
    name: 'Sáb',
    intentos: 5,
    foco: 3
  }, {
    name: 'Dom',
    intentos: 6,
    foco: 4
  }];
  return <div className="h-full w-full flex flex-col bg-white px-6 py-8">
      <div className="flex items-center mb-6">
        <button className="mr-4 p-2 rounded-md bg-cream border border-cream-dark text-gray-700 hover:bg-cream-dark transition-colors" onClick={onGoBack}>
          <ArrowLeftIcon className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-medium text-gray-700">Tu progreso</h1>
      </div>
      <div className="bg-white rounded-md border border-gray-300 shadow-sm p-5 mb-6">
        <div className="flex items-center mb-4">
          <TrendingUpIcon className="w-5 h-5 text-gray-700 mr-2" />
          <h2 className="text-lg font-medium text-gray-700">
            Estadísticas de esta semana
          </h2>
        </div>
        <div className="h-64 mb-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{
            top: 10,
            right: 10,
            left: -20,
            bottom: 0
          }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{
              borderRadius: '4px',
              border: '1px solid #E2E8F0',
              boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
            }} />
              <Bar dataKey="intentos" name="Intentos de distracción" fill="#F2D98D" radius={[4, 4, 0, 0]} />
              <Bar dataKey="foco" name="Veces que elegiste enfocarte" fill="#E9CC7A" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="bg-white rounded-md border border-gray-300 p-5 mb-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-medium text-gray-700">Hoy</h3>
          <span className="text-sm text-gray-700 font-medium">Jueves</span>
        </div>
        <div className="flex space-x-4 mb-3">
          <div className="flex-1 bg-white rounded-md border border-gray-300 p-3 shadow-sm">
            <p className="text-sm text-gray-500 mb-1">Intentos</p>
            <p className="text-2xl font-medium text-gray-800">12</p>
          </div>
          <div className="flex-1 bg-white rounded-md border border-gray-300 p-3 shadow-sm">
            <p className="text-sm text-gray-500 mb-1">Enfoque</p>
            <p className="text-2xl font-medium text-gray-700">8</p>
          </div>
        </div>
        <p className="text-center text-gray-700 font-medium">
          Hoy redirigiste tu foco 8 veces. ¡Bien hecho!
        </p>
      </div>
      <div className="bg-white rounded-md border border-gray-300 p-5">
        <h3 className="text-lg font-medium text-gray-700 mb-2">
          Tu racha actual
        </h3>
        <div className="flex items-center justify-center">
          <div className="text-center">
            <p className="text-3xl font-bold text-gray-700 mb-1">5 días</p>
            <p className="text-sm text-gray-600">Mantén el buen trabajo</p>
          </div>
        </div>
      </div>
    </div>;
};
export default MetricsScreen;
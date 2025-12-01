import { MoreVertical, Edit2, Trash2, Eye, Calendar, DollarSign, User } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'

const NominaFijaCard = ({ nomina, onEdit, onDelete, onViewDetails }) => {
    const [showMenu, setShowMenu] = useState(false)
    const menuRef = useRef(null)

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setShowMenu(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('es-MX', {
            style: 'currency',
            currency: 'MXN'
        }).format(value || 0)
    }

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A'
        const date = new Date(dateString)
        return date.toLocaleDateString('es-MX', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        })
    }

    const totalNeto = (
        parseFloat(nomina.gananciaBase || 0) +
        parseFloat(nomina.extra || 0) -
        parseFloat(nomina.deben || 0)
    )

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-all overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-4">
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <div className="flex items-center space-x-2">
                            <User className="h-5 w-5 text-white" />
                            <h3 className="font-semibold text-white truncate">{nomina.nombre}</h3>
                        </div>
                        {nomina.alias && (
                            <p className="text-purple-100 text-sm mt-1">@{nomina.alias}</p>
                        )}
                    </div>
                    <div className="relative" ref={menuRef}>
                        <button
                            onClick={() => setShowMenu(!showMenu)}
                            className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
                        >
                            <MoreVertical className="h-5 w-5 text-white" />
                        </button>

                        {showMenu && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-10">
                                <button
                                    onClick={() => {
                                        onViewDetails(nomina)
                                        setShowMenu(false)
                                    }}
                                    className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center space-x-2"
                                >
                                    <Eye className="h-4 w-4" />
                                    <span>Ver detalles</span>
                                </button>
                                <button
                                    onClick={() => {
                                        onEdit(nomina)
                                        setShowMenu(false)
                                    }}
                                    className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center space-x-2"
                                >
                                    <Edit2 className="h-4 w-4" />
                                    <span>Editar</span>
                                </button>
                                <button
                                    onClick={() => {
                                        onDelete(nomina)
                                        setShowMenu(false)
                                    }}
                                    className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                                >
                                    <Trash2 className="h-4 w-4" />
                                    <span>Eliminar</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="p-4 space-y-3">
                {/* Periodo */}
                <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-2 text-slate-600">
                        <Calendar className="h-4 w-4" />
                        <span>Periodo</span>
                    </div>
                    <span className="font-medium text-slate-900">
                        {formatDate(nomina.periodoInicio)} - {formatDate(nomina.periodoFin)}
                    </span>
                </div>

                {/* Detalles Financieros */}
                <div className="space-y-2 pt-2 border-t border-slate-100">
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-600">Ganancia Base</span>
                        <span className="font-semibold text-slate-900">{formatCurrency(nomina.gananciaBase)}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-600">Extra</span>
                        <span className="font-semibold text-green-600">{formatCurrency(nomina.extra)}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-600">Deben</span>
                        <span className="font-semibold text-red-600">-{formatCurrency(nomina.deben)}</span>
                    </div>
                </div>

                {/* Total */}
                <div className="pt-3 border-t border-slate-200">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <DollarSign className="h-5 w-5 text-purple-600" />
                            <span className="text-sm font-medium text-slate-700">Total Neto</span>
                        </div>
                        <span className="text-xl font-bold text-purple-600">{formatCurrency(totalNeto)}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default NominaFijaCard

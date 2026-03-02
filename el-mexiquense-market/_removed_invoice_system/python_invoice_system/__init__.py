#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Sistema de Facturación - El Mexiquense Market
Paquete principal
"""

__version__ = '1.0.0'
__author__ = 'El Mexiquense Market'

from .inventario import InventarioManager
from .facturacion import FacturaManager

__all__ = ['InventarioManager', 'FacturaManager']

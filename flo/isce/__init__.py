# -*- Python -*-
# -*- coding: utf-8 -*-
#
# michael a.g. aïvázis <michael.aivazis@para-sim.com>
# parasim
# (c) 1998-2019 all rights reserved
#


# support
import flo


# products
@flo.foundry(implements=flo.model.frame, tip="the ALOS frame product")
def alosFrame():
    # get the implementation
    from .ALOSFrame import ALOSFrame
    # borrow its docstring
    __doc__ = ALOSFrame.__doc__
    # and publish it
    return ALOSFrame


@flo.foundry(implements=flo.model.raw, tip="the ISCE RAW data product")
def raw():
    # get the implementation
    from .RAW import RAW
    # borrow its docstring
    __doc__ = RAW.__doc__
    # and publish it
    return RAW


@flo.foundry(implements=flo.model.slc, tip="the ISCE SLC data product")
def slc():
    # get the implementation
    from .SLC import SLC
    # borrow its docstring
    __doc__ = SLC.__doc__
    # and publish it
    return SLC


@flo.foundry(implements=flo.model.slc, tip="the interferogram product")
def interferogram():
    # get the implementation
    from .Interferogram import Interferogram
    # borrow its docstring
    __doc__ = Interferogram.__doc__
    # and publish it
    return Interferogram


# factories
@flo.foundry(implements=flo.model.sensor, tip="the ALOS frame parser")
def alos():
    # get the implementation
    from .ALOS import ALOS
    # borrow its docstring
    __doc__ = ALOS.__doc__
    # and publish it
    return ALOS


@flo.foundry(implements=flo.model.formSLC, tip="the ISCE SLC factory")
def formSLC():
    # get the implementation
    from .FormSLC import FormSLC
    # borrow its docstring
    __doc__ = FormSLC.__doc__
    # and publish it
    return FormSLC


@flo.foundry(implements=flo.model.resamp, tip="the interferogram factory")
def resamp():
    # get the implementation
    from .Resamp import Resamp
    # borrow its docstring
    __doc__ = Resamp.__doc__
    # and publish it
    return Resamp


# functions that create instances of products and factories
def newALOSFrame(**kwds):
    """
    Build a new instance of an ALOS frame
    """
    # get the class
    from .ALSFrame import ALOSFrame
    # build one and return it
    return ALOSFrame(**kwds)


def newRAW(**kwds):
    """
    Build a new instance of a RAW product
    """
    # get the class
    from .RAW import RAW
    # build one and return it
    return RAW(**kwds)


def newSLC(**kwds):
    """
    Build a new instance of a SLC product
    """
    # get the class
    from .SLC import SLC
    # build one and return it
    return SLC(**kwds)


def newInterferogram(**kwds):
    """
    Build a new instance of an interferogram
    """
    # get the class
    from .Interferogram import Interferogram
    # build one and return it
    return Interferogram(**kwds)


def newALOS(**kwds):
    """
    Build a new instance of an ALOS frame parser
    """
    # get the class
    from .ALOS import ALOS
    # build one and return it
    return ALOS(**kwds)


def newFormSLC(**kwds):
    """
    Build a new instance of a FormSLC factory
    """
    # get the class
    from .FormSLC import FormSLC
    # build one and return it
    return FormSLC(**kwds)


def newResamp(**kwds):
    """
    Build a new instance of the interferogram fractory
    """
    # get the class
    from .Resamp import Resamp
    # build one and return it
    return Resamp(**kwds)


# end of file

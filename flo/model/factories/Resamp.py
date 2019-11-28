#-*- coding: utf-8 -*-


# get the package
import flo


# resample SLCs
class Resamp(flo.flow.producer, family="flo.factories.resamp"):
    """
    Resample an SLC
    """

    # framework hooks
    @classmethod
    def pyre_default(cls, **kwds):
        """
        Supply the reference implementation of the {resamp} factory
        """
        # get the {isce3} reference implementation and publish it
        return flo.isce3.factories.resamp()


# end of file

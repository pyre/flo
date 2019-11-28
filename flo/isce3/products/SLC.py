#-*- coding: utf-8 -*-


# support
import flo


# the product
class SLC(flo.flow.product,
          family="isce3.products.slc", implements=flo.model.products.slc):
    """
    The base SLC product
    """


    # product meta-data
    samples = flo.properties.int()
    samples.doc = "the number of samples in a line"

    lines = flo.properties.int()
    lines.doc = "the number of acquisition lines"


    # public data
    info = None
    orbit = None
    dopplerCentroid = None

    data = None


# end of file

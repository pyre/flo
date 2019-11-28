#-*- coding: utf-8 -*-


# support
import flo
# superclass
from .Workflow import Workflow


# declaration
class Geo2Rdr(Workflow, family="flo.cli.geo2rdr"):
    """
    Invoke the {geo2rd} workflow to compute the transformation from geodetic coordinates to
    radar coordinates for a given SLC
    """


    # public state
    flow = flo.model.flows.flow()
    flow.default = flo.isce3.workflows.geo2rdr # by default, make the one named after me...
    flow.doc = "the workflow to execute"


# end of file

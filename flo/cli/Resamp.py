#-*- coding: utf-8 -*-


# support
import flo
# superclass
from .Workflow import Workflow


# declaration
class Resamp(Workflow, family="flo.cli.resamp"):
    """
    Invoke the {resamp} workflow to resample an SLC
    """


    # public state
    flow = flo.model.flows.flow()
    flow.default = flo.isce3.workflows.resamp # by default, make the one named after me...
    flow.doc = "the workflow to execute"


# end of file

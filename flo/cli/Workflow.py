#-*- coding: utf-8 -*-


# support
import flo
# the configuration renderer
from .Renderer import Renderer


# declaration
class Workflow(flo.shells.command, family="flo.cli.workflow"):
    """
    Base class for command panels that invoke workflows
    """


    # public state
    flow = flo.model.flows.flow()
    flow.doc = "the workflow to execute"

    ws = flo.properties.str(default=None)
    ws.doc = "the name of the workspace"


    # create a new generic flow; subclasses can specialize by providing a default value for the
    # flow trait
    @flo.export(tip="create a new instance of the workflow")
    def new(self, plexus, **kwds):
        """
        Persist the current flow in a configuration file
        """
        # get my flow
        flow = self.flow
        # if the flow is trivial
        if flow is None:
            # nothing to do
            return 0
        # otherwise, grab a channel
        channel = plexus.info
        # show me
        channel.log(f"creating '{flow.pyre_name}'")

        # get the workspace the user requested
        ws = self.ws
        # if there wasn't one
        if ws is None:
            # save the new flow in a local configuration file
            flow.pyre_save()
            # all done
            return 0

        # get the datastore
        db = flo.db.postgres()
        # point it to the workspace
        db.database = ws

        # attempt to
        try:
            # connect to the workspace
            db.attach()
        # if this fails
        except db.exceptions.OperationalError as error:
            # grab a channel
            channel = plexus.error
            # complain
            channel.log(f"workspace '{ws}' doesn't exist")
            # and bail
            return 1

        # get the table of flows
        flows = flo.schema.flows
        # make a new flow record
        record = flows.pyre_immutable(
            flow = flow.pyre_name,
            type = flow.pyre_family(),
            )
        # attempt to
        try:
            # insert it to the workspace
            db.insert(record)
        # if this fails
        except db.exceptions.ProgrammingError as error:
            # grab a channel
            channel = plexus.error
            # complain
            channel.log(f"flow '{flow.pyre_spec}' already exists in workspace '{ws}'")
            # and bail
            return 1

        # get the configuration table
        config = flo.schema.config
        # make a pile
        assignments = []
        # go through the flow parts and build configuration settings
        for trait, value in flow.pyre_renderTraitValues(renderer=Renderer()):
            # make a new configuration assignment
            assignment = config.pyre_immutable(
                flow = flow.pyre_name,
                name = trait,
                value = value
                )
            # add it to the pile
            assignments.append(assignment)
        # attempt to
        try:
            # add them to the workspace
            db.insert(*assignments)
        # if this fails
        except db.exceptions.ProgrammingError as error:
            # grab a channel
            channel = plexus.error
            # complain
            channel.line(f"failed to  configure flow '{flow.pyre_spec}'")
            # and say why
            channel.log(f"  error: {error}")
            # and bail
            return 1

        # all done
        return 0


    # execute the flow
    @flo.export(tip="execute the flow")
    def run(self, plexus, **kwds):
        """
        Execute the current workflow
        """
        # get my flow
        flow = self.flow
        # if the flow is trivial
        if flow is None:
            # nothing to do
            return 0

        # otherwise, grab a channel
        channel = plexus.info
        # show me
        channel.log(f"executing '{flow.pyre_spec}'")
        # run the flow
        flow.pyre_make()
        # all done
        return 0


    # load a persisted flow and display its layout
    @flo.export(tip="display information about an existing workflow instance")
    def info(self, plexus, **kwds):
        """
        Load a flow from a configuration file and display its layout
        """
        # get my flow
        flow = self.flow
        # if the flow is trivial
        if flow is None:
            # nothing to do
            return 0

        # otherwise, grab a channel
        channel = plexus.info
        # show me
        channel.line()
        # show me
        flow.pyre_dump(channel=channel, level=0)
        # flush
        channel.log()
        # all done
        return 0


# end of file

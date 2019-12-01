# -*- coding: utf-8 -*-
#
# michael a.g. aïvázis <michael.aivazis@para-sim.com>
# parasim
# (c) 1998-2019 all rights reserved
#


# externals
import flo


# declaration
class Workspaces(flo.shells.command, family='flo.actions.ws'):
    """
    Manage workspaces
    """


    # user configurable state
    name = flo.properties.str(default=None)
    name.doc = "the name of the workspace"

    tables = flo.properties.set(schema=flo.properties.str())
    tables.doc = "restrict the tables affected by a command to this set"


    # commands
    @flo.export(tip="create a new workspace")
    def new(self, plexus, **kwds):
        """
        Create a new workspace
        """
        # get the name
        name = self.name
        # if no name was given
        if not name:
            # grab a channel
            channel = plexus.error
            # complain
            channel.log("please provide the name of the workspace")
            # and show the help screen
            return self.help(plexus=plexus)

        # show me
        plexus.info.log(f"creating '{name}', a new workspace")

        # build a database component
        db = flo.db.postgres()
        # verify it's going to attach to the administrative database
        assert db.database == "postgres"
        # attach
        db.attach()

        # attempt to
        try:
            # create a database for the new workspace
            db.createDatabase(name=name)
        # if this fails
        except db.exceptions.ProgrammingError as error:
            # grab a channel
            channel = plexus.error
            # show me
            channel.log(error.diagnostic)
            # indicate failure
            return 1

        # all done
        return 0


    @flo.export(tip="delete a workspace")
    def delete(self, plexus, **kwds):
        # get the name
        name = self.name
        # if no name was given
        if not name:
            # grab a channel
            channel = plexus.error
            # complain
            channel.log("please provide the name of the workspace")
            # and show the help screen
            return self.help(plexus=plexus)

        # show me
        plexus.info.log(f"deleting the workspace '{name}'")

        # build a database component
        db = flo.db.postgres()
        # verify it's going to attach to the administrative database
        assert db.database == "postgres"
        # attach
        db.attach()

        # attempt to
        try:
            # create a database for the new workspace
            db.dropDatabase(name=name)
        # if this fails
        except db.exceptions.ProgrammingError as error:
            # grab a channel
            channel = plexus.error
            # show me
            channel.log(error.diagnostic)
            # indicate failure
            return 1

        # all done
        return 0


    @flo.export(tip='initialize an existing workspace')
    def init(self, plexus, **kwds):
        """
        Create a subset of the tables that capture my schema
        """
        # get the name
        name = self.name
        # if no name was given
        if not name:
            # grab a channel
            channel = plexus.error
            # complain
            channel.log("please provide the name of the workspace")
            # and show the help screen
            return self.help(plexus=plexus)

        # show me
        plexus.info.log(f"initializing the workspace '{name}'")

        # get the datastore
        db = flo.db.postgres()
        # point it to the workspace database
        db.database = name

        # attempt to
        try:
            # attach
            db.attach()
        # if this fails
        except db.exceptions.OperationalError as error:
            # grab a channel
            channel = plexus.error
            # show me
            channel.log(f"workspace '{name}' doesn't exist")
            # indicate failure
            return 1

        # get the schema
        schema = flo.schema
        # get the set of tables to build
        tables = self.tables
        # if the user didn't restrict to a specific subset, build them all
        tables = tables if tables else {table.pyre_name for table in schema.tables}

        # go through the schema, in dependency order
        for table in reversed(schema.tables):
            # if this on is on the pile
            if table.pyre_name in tables:
                # attempt to
                try:
                    # build it
                    db.createTable(table)
                # if something goes wrong
                except db.exceptions.ProgrammingError as error:
                    # grab a channel
                    channel = plexus.warning
                    # complain
                    channel.log(f"table '{table.pyre_name}' already exists")

        # all done
        return 0


    @flo.export(tip='clear an existing workspace')
    def clear(self, plexus, **kwds):
        """
        Drop a subset of the tables that capture my schema
        """
        # get the name
        name = self.name
        # if no name was given
        if not name:
            # grab a channel
            channel = plexus.error
            # complain
            channel.log("please provide the name of the workspace")
            # and show the help screen
            return self.help(plexus=plexus)

        # show me
        plexus.info.log(f"clearing the workspace '{name}'")

        # get the datastore
        db = flo.db.postgres()
        # point it to the workspace database
        db.database = name

        # attempt to
        try:
            # attach
            db.attach()
        # if this fails
        except db.exceptions.OperationalError as error:
            # grab a channel
            channel = plexus.error
            # show me
            channel.log(f"workspace '{name}' doesn't exist")
            # indicate failure
            return 1

        # get the schema
        schema = flo.schema
        # get the set of tables to build
        tables = self.tables
        # if the user didn't restrict to a specific subset, build them all
        tables = tables if tables else {table.pyre_name for table in schema.tables}

        # go through the schema, in dependency order
        for table in schema.tables:
            # if this on is on the pile
            if table.pyre_name in tables:
                # attempt to
                try:
                    # drop it
                    db.dropTable(table)
                # if something goes wrong
                except db.exceptions.ProgrammingError as error:
                    # grab a channel
                    channel = plexus.warning
                    # complain
                    channel.log(f"table '{table.pyre_name}' does not exist")

        # all done
        return 0


    @flo.export(tip='clear an existing workspace')
    def flows(self, plexus, **kwds):
        """
        Drop a subset of the tables that capture my schema
        """
        # get the name
        name = self.name
        # if no name was given
        if not name:
            # grab a channel
            channel = plexus.error
            # complain
            channel.log("please provide the name of the workspace")
            # and show the help screen
            return self.help(plexus=plexus)

        # get the datastore
        db = flo.db.postgres()
        # point it to the workspace database
        db.database = name

        # attempt to
        try:
            # attach
            db.attach()
        # if this fails
        except db.exceptions.OperationalError as error:
            # grab a channel
            channel = plexus.error
            # show me
            channel.log(f"workspace '{name}' doesn't exist")
            # indicate failure
            return 1

        # grab a channel
        channel = plexus.info
        # sign on
        channel.line("flows:")
        # get the known flows
        flows = db.select(flo.schema.flows)
        # go through each one
        for flow in flows:
            # show me
            channel.line(f"    {flow.flow}: {flow.type}")
        # flush
        channel.log()

        # all done
        return 0


# end of file

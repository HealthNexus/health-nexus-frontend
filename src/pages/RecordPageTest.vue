<template>
  <q-page class="form-records-page">
    <q-header elevated>
      <q-toolbar>
        <q-toolbar-title>JetFormBuilder Form Records</q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <q-page-padding>
        <div class="filter-section q-pa-md q-gutter-md">
          <q-btn-dropdown label="Bulk actions" color="primary" class="q-mr-sm">
            <q-list>
              <q-item clickable v-ripple>
                <q-item-section>Delete</q-item-section>
              </q-item>
              <q-item clickable v-ripple>
                <q-item-section>Export</q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>
          <q-btn label="Apply" color="primary" class="q-mr-md" />
          <q-select outlined label="Select Form" :options="forms" class="q-mr-md" />
          <q-btn label="Clear Filters" color="primary" outline />
        </div>

        <q-table
          :rows="rows"
          :columns="columns"
          row-key="id"
          selection="multiple"
          :rows-per-page-options="[3]"
          :rows-per-page="3"
        >
          <template v-slot:body-cell-form="props">
            <q-td>
              <q-checkbox v-model="props.selected" />
              <a :href="props.row.formLink">{{ props.row.form }}</a>
            </q-td>
          </template>
          <template v-slot:body-cell-referrer="props">
            <q-td>
              <a :href="props.row.referrerLink">{{ props.row.referrer }}</a>
            </q-td>
          </template>
          <template v-slot:body-cell-status="">
            <q-td>
              <q-badge color="green" label="success" />
            </q-td>
          </template>
        </q-table>

        <q-footer class="footer">
          <div class="footer-content q-pt-lg q-pb-lg">
            <p>Showing 1 - 3 of 3 results.</p>
          </div>
        </q-footer>
      </q-page-padding>
    </q-page-container>
  </q-page>
</template>

<script>
export default {
  data() {
    return {
      forms: ['Application Form', 'Contact Us'],
      rows: [
        {
          id: 1,
          form: 'Application Form',
          formLink: '#',
          referrer: 'Page for application',
          referrerLink: '#',
          status: 'success',
          submittedBy: 'Chris Brown',
          created: 'March 25, 2022, 14:33:49'
        },
        {
          id: 2,
          form: 'Contact Us',
          formLink: '#',
          referrer: 'Contact Us',
          referrerLink: '#',
          status: 'success',
          submittedBy: 'AshleyO',
          created: 'March 23, 2022, 13:31:08'
        },
        {
          id: 3,
          form: 'Contact Us',
          formLink: '#',
          referrer: 'Contact Us',
          referrerLink: '#',
          status: 'success',
          submittedBy: 'JuliaCroco',
          created: 'March 19, 2022, 11:35:35'
        }
      ],
      columns: [
        { name: 'form', align: 'left', label: 'Form', field: 'form', sortable: true },
        { name: 'referrer', align: 'left', label: 'Referrer', field: 'referrer', sortable: true },
        { name: 'status', align: 'center', label: 'Status', field: 'status', sortable: true },
        { name: 'submittedBy', align: 'left', label: 'Submitted By', field: 'submittedBy', sortable: true },
        { name: 'created', align: 'left', label: 'Created', field: 'created', sortable: true }
      ]
    };
  }
};
</script>

<style scoped>
.form-records-page {
  text-align: center;
}

.filter-section {
  display: flex;
  align-items: center;
}

.footer {
  padding: 20px 0;
  background-color: #f0f0f0;
}

.footer-content {
  text-align: center;
}
</style>

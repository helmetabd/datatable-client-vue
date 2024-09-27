<script setup lang="ts">
const dataTables = [
  {
    id: 1,
    name: 'Kellie Whitfield',
    phone: '(723) 523-9492',
    status: 1,
    email: 'ac.tellus@yahoo.com'
  },
  {
    id: 2,
    name: 'Eve Fernandez',
    phone: '(458) 923-1615',
    status: 2,
    email: 'ipsum.cursus.vestibulum@google.com'
  },
  {
    id: 3,
    name: 'Erasmus Gray',
    phone: '1-222-594-7477',
    status: 1,
    email: 'nec.enim.nunc@outlook.couk'
  },
  {
    id: 4,
    name: 'Kim Middleton',
    phone: '(124) 321-3762',
    status: 3,
    email: 'vestibulum.mauris@google.edu'
  },
  {
    id: 5,
    name: 'Colton Mejia',
    phone: '1-861-476-2861',
    status: 2,
    email: 'urna@outlook.com'
  },
  {
    id: 6,
    name: 'Haley Torres',
    phone: '(276) 667-7887',
    status: 2,
    email: 'amet.ante@hotmail.ca'
  },
  {
    id: 7,
    name: 'Adria Burris',
    phone: '1-857-824-8496',
    status: 2,
    email: 'metus.aliquam@hotmail.net'
  },
  {
    id: 8,
    name: 'Larissa Allen',
    phone: '(863) 861-6210',
    status: 2,
    email: 'arcu.iaculis.enim@outlook.edu'
  },
  {
    id: 9,
    name: 'Claire Rivers',
    phone: '1-644-275-5578',
    status: 2,
    email: 'feugiat@icloud.org'
  },
  {
    id: 10,
    name: 'Jelani Guerrero',
    phone: '(445) 564-5202',
    status: 1,
    email: 'urna.nullam.lobortis@icloud.com'
  },
  {
    id: 11,
    name: 'Lucian Joyner',
    phone: '1-133-566-9551',
    status: 2,
    email: 'vestibulum.nec@protonmail.edu'
  },
  {
    id: 12,
    name: 'Cameran Mccall',
    phone: '(465) 265-5363',
    status: 3,
    email: 'mollis.integer@yahoo.edu'
  },
  {
    id: 13,
    name: 'Aimee Simon',
    phone: '1-743-483-5628',
    status: 2,
    email: 'est.nunc.laoreet@google.org'
  },
  {
    id: 14,
    name: 'Kyle Barlow',
    phone: '1-570-152-4863',
    status: 2,
    email: 'nibh@hotmail.ca'
  },
  {
    id: 15,
    name: 'Kaseem Clemons',
    phone: '(759) 518-2485',
    status: 2,
    email: 'eget.varius.ultrices@aol.couk'
  },
  {
    id: 16,
    name: 'Ria Barrett',
    phone: '1-425-829-2568',
    status: 2,
    email: 'id@icloud.org'
  },
  {
    id: 17,
    name: 'Kenyon Norton',
    phone: '(442) 201-6082',
    status: 2,
    email: 'a.ultricies@google.org'
  },
  {
    id: 18,
    name: 'Dara Navarro',
    phone: '1-393-742-5785',
    status: 3,
    email: 'ipsum.leo@icloud.couk'
  },
  {
    id: 19,
    name: 'Ferris Fletcher',
    phone: '1-280-976-7258',
    status: 2,
    email: 'habitant@icloud.couk'
  },
  {
    id: 20,
    name: 'Drew Hensley',
    phone: '(260) 525-0133',
    status: 1,
    email: 'aliquet@aol.edu'
  }
]
const columns = [
  {
    label: 'ID',
    name: 'id',
    targetCollapsed: true,
    sortable: true,
    filterable: false
  },
  {
    name: 'name',
    label: 'Staff',
    sortable: true,
    filterable: true,
    class: 'text-info',
    headerClass: 'text-warning',
    custom: {
      icon: 'las la-crown text-warning fs-16',
      uniqueFirst: {
        fields: 'id',
        value: 1,
        icon: 'las la-crown text-warning fs-16'
      },
      uniqueIcon: true
    }
  },
  {
    name: 'id',
    label: 'Number',
    isNumber: true,
    sortable: true,
    filterable: true,
    class: 'text-center',
    headerClass: 'text-info'
  },
  {
    name: 'id',
    label: 'Number',
    currency: 'Rp',
    isNumber: true,
    sortable: true,
    filterable: true,
    class: 'text-end',
    headerClass: 'text-danger'
  },
  {
    name: 'phone',
    label: 'Phone',
    sortable: true,
    filterable: true,
    class: 'fw-bolder'
  },
  {
    name: 'email',
    label: 'Email',
    sortable: true,
    filterable: true
  },
  {
    name: 'status',
    label: 'Status',
    sortable: true,
    filterable: true,
    badge: {
      types: [
        { value: 3, type: 'info', label: 'User' },
        { value: 2, type: 'warning', label: 'Admin' },
        { value: 1, type: 'danger', label: 'Super Admin' }
      ]
    },
  },
  {
    name: 'custom',
    label: 'Custom',
    sortable: true,
    filterable: true,
    customizeRow: true
  }
]
</script>

<template>

  <body>
    <div class="container">
      <div class="row m-4">
        <div class="col">
          <div class="card p-2">
            <div class="card-title mb-0">
              <h3>Datatable Client</h3>
            </div>
            <div class="card-body">
              <datatable-client :dataTable="dataTables" :column="columns"
                :buttons="{ copy: true, excel: true, print: true }" copyTitle="Test Copy" collapsed>
                <template #column-name-unique="{ item }">
                  <span class="incomplete" v-if="item.id > 1">
                    <strong>
                      <i class="las la-exclamation-circle text-danger fs-5 align-middle"></i>
                    </strong>
                  </span>
                </template>
                <template #column-custom="{ item }">
                  <span class="badge bg-success-subtle text-success">{{ item.name }}</span>
                </template>
                <template #childCollapsed="{ item }">
                  <ul class="dtr-details">
                    <li>
                      <span class="dtr-title">Name</span>
                      <span class="dtr-data">{{ item.name }}</span>
                    </li>
                    <li>
                      <span class="dtr-title">Phone</span>
                      <span class="dtr-data">{{ item.phone }}</span>
                    </li>
                    <li>
                      <span class="dtr-title">Email</span>
                      <span class="dtr-data">{{ item.email }}</span>
                    </li>
                  </ul>
                </template>
              </datatable-client>
            </div>
          </div>
        </div>
      </div>
    </div>
  </body>
</template>

<style></style>

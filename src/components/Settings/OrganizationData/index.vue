<template lang="pug">
  .organization()
    .row.justify-center
      .col-6
        .row.q-py-lg
          .text-h5 Данные организации
        .row.q-pb-xs
          .col.q-pr-sm
            span Название&nbsp;
            span.text-red *
          .col.q-pr-sm
            span Тип&nbsp;
            span.text-red *
        .row
          .col.q-pr-sm
            q-input(v-model="organization.name" :rules="[val => !!val || 'Обязательно для заполнения']" outlined dense)
          .col.q-pr-sm
            q-select(v-model="organization.legalType" :options="organization.types" outlined dense)
        .row.q-pb-xs
          .col.q-pr-sm
            span Телефон
        .row.q-pb-md
          .col.q-pr-sm
            telephone(:organization="organization")
        .row.q-pb-xs
          .col.q-pr-sm
            span Юридический адрес&nbsp;
            span.text-red *
        .row
          .col.q-pr-sm
            q-input(v-model="organization.address" :rules="[val => !!val || 'Обязательно для заполнения']" outlined dense)
        .row.q-pb-md
          q-checkbox(v-model="organization.isRealAddress" @input="equalAddresses" label="Юридический адрес совпадает с фактическим.")
        .realAddress(v-if="!organization.isRealAddress")
          .row.q-pb-xs
            .col.q-pr-sm
              span Фактический адрес&nbsp;
              span.text-red *
          .row.q-pb-md
            .col.q-pr-sm
              q-input(v-model="organization.legalAddress" :rules="[val => !!val || 'Обязательно для заполнения']" outlined dense)
        .row.q-pb-xs
          .col.q-pr-sm
            span Ген. директор&nbsp;
            span.text-red *
          .col.q-pr-sm
            span Бухгалтер
        .row.q-pb-md
          .col.q-pr-sm
            q-input(v-model="organization.ceo" :rules="[val => !!val || 'Обязательно для заполнения']" outlined dense)
          .col.q-pr-sm
            q-input(v-model="organization.accountant" outlined dense)
        .row.q-pb-xs
          .col.q-pr-sm
            span ОГРН&nbsp;
            span.text-red *
          .col.q-pr-sm
            span ИНН&nbsp;
            span.text-red *
        .row.q-pb-md
          .col.q-pr-sm
            q-input(v-model="organization.ogrn" :rules="[val => !!val || 'Обязательно для заполнения']" outlined dense)
          .col.q-pr-sm
            q-input(v-model="organization.inn" :rules="[val => !!val || 'Обязательно для заполнения']" outlined dense)
        .row.q-pb-xs
          .col.q-pr-sm
            span КПП&nbsp;
            span.text-red *
        .row.q-pb-md
          .col-6.q-pr-sm
            q-input(v-model="organization.kpp" :rules="[val => !!val || 'Обязательно для заполнения']" outlined dense)
        .row.q-py-lg
          .text-h5 Банковские реквизиты
        .row.q-pb-xs
          .col.q-pr-sm
            span БИК&nbsp;
            span.text-red *
          .col.q-pr-sm
            span Кор. счет&nbsp;
            span.text-red *
        .row.q-pb-md
          .col.q-pr-sm
            q-input(v-model="organization.bic" :rules="[val => !!val || 'Обязательно для заполнения']" outlined dense)
          .col.q-pr-sm
            q-input(v-model="organization.corr" :rules="[val => !!val || 'Обязательно для заполнения']" outlined dense)
        .row.q-pb-xs
          .col.q-pr-sm
            span Банк&nbsp;
            span.text-red *
          .col.q-pr-sm
            span Рассчетный счет&nbsp;
            span.text-red *
        .row.q-pb-md
          .col.q-pr-sm
            q-input(v-model="organization.bank" :rules="[val => !!val || 'Обязательно для заполнения']" outlined dense)
          .col.q-pr-sm
            q-input(v-model="organization.account" :rules="[val => !!val || 'Обязательно для заполнения']" outlined dense)
        // TODO - возможно понадобится добавление сотрудника!!!
        //.row.q-py-lg
          .text-h5 Сотрудники
        //.row.q-pb-md
          .col
            q-list(border separator style="width: 100%;")
              q-item(clickable v-for="item in employees" :key="item.id" @click="hasModal(item)").items-center
                q-item-label.col-3.q-mr-sm {{ item.id }}. {{ item.name }}
                q-item-label.col-8.q-mr-sm
                  .inline-block(v-for="(role, index) in item.role" :key="index")
                    q-chip.bg-primary(v-if="role.isRole" square) {{ role.name }}
                q-item-label.col-1.q-ml-sm
                  q-icon(name="edit" style="font-size: 20px;")
        .row.q-py-lg
          .col.q-pr-sm
            q-btn.bg-primary.text-white(label="Сохранить" no-caps style="width: 100%;" @click="saveChanges")
          //.col
            q-btn(label="Добавить сотрудника" no-caps style="width: 100%;")
      //q-dialog(v-model="isModal")
        q-card(style="min-width: 480px;")
          employees(
           // :employees="employerProps"
           // :phone="phone"
            @closeModal="isModal = false"
          )
</template>

<script>
import employees from './employees'
import organizationSettings from '../../../api/organizationSettings'
import telephone from './phone'
export default {
  name: 'rules',
  components: { employees, telephone },
  data () {
    return {
      organization: {},
      isModal: false,
    }
  },
  methods: {
    async getData () {
      const { data } = await organizationSettings.getOne()
      if (!data.name) return
      return data
    },
    hasModal (value) {
      this.isModal = true
      this.employerProps = value
    },
    async saveChanges () {
      const result = await organizationSettings.updateOne(this.organization.id, this.organization)
      if (result.hasOwnProperty('data')) {
        this.showNotif('Изменения сохранены', 'green')
      } else if (result.hasOwnProperty('errors')) {
        this.showNotif('Проверьте обязательные поля')
        result.errors.forEach(item => {
          if (item.source === 'phone') {
            console.warn('Phone')
          } else {
            this.organization[item.source] = ''
          }
        })
      }
    },
    equalAddresses () {
      if (this.organization.isRealAddress) {
        this.organization.legalAddress = this.organization.address
      }
    },
    showNotif (msg, clr = 'purple') {
      this.$q.notify({
        message: msg,
        color: clr
      })
    }
  },
  async mounted () {
    this.organization = await this.getData()
  }
}
</script>

<style scoped>

</style>
